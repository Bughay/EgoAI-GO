package deepseek

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ChatTemplate struct {
	Model           string                 `json:"model"`
	Messages        []Message              `json:"messages"`
	Stream          bool                   `json:"stream"`
	Temperature     float64                `json:"temperature,omitempty"`
	MaxTokens       int                    `json:"max_tokens,omitempty"`
	ResponseFormat  *ResponseFormat        `json:"response_format,omitempty"`
	ReasoningEffort string                 `json:"reasoning_effort,omitempty"`
	ExtraBody       map[string]interface{} `json:"extra_body,omitempty"`
}

type ResponseFormat struct {
	Type string `json:"type"`
}

type ChatResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
		FinishReason string `json:"finish_reason"`
	} `json:"choices"`
}

type ChatResponseFull struct {
	ID      string `json:"id"`
	Object  string `json:"object"`
	Created int64  `json:"created"`
	Model   string `json:"model"`
	Choices []struct {
		Index   int `json:"index"`
		Message struct {
			Role             string  `json:"role"`
			Content          string  `json:"content"`
			ReasoningContent *string `json:"reasoning_content,omitempty"` // for reasoning models
			Refusal          *string `json:"refusal,omitempty"`
		} `json:"message"`
		FinishReason string `json:"finish_reason"`
	} `json:"choices"`
	Usage struct {
		PromptTokens            int `json:"prompt_tokens"`
		CompletionTokens        int `json:"completion_tokens"`
		TotalTokens             int `json:"total_tokens"`
		CompletionTokensDetails struct {
			ReasoningTokens int `json:"reasoning_tokens"`
		} `json:"completion_tokens_details,omitempty"`
	} `json:"usage"`
	SystemFingerprint string `json:"system_fingerprint"`
}

// const deepseekURL = "https://api.deepseek.com/v1/chat/completions"

const deepseekURL = "https://api.deepseek.com/beta/v1/chat/completions"

// const deepseekURL = "https://api.deepseek.com"

func DeepseekOneshot(model string, systemMessage string, userMessage string, temperature float64, maxTokens int) (string, error) {
	if err := godotenv.Load(); err != nil {
		return "", fmt.Errorf("load .env: %w", err)
	}

	apiKey := os.Getenv("DEEPSEEKAPIKEY")
	if apiKey == "" {
		return "", fmt.Errorf("DEEPSEEKAPIKEY not set")
	}

	extraBody := make(map[string]interface{})
	extraBody["thinking"] = map[string]string{"type": "enabled"}
	chat := &ChatTemplate{
		Model: model,
		Messages: []Message{
			{Role: "system", Content: systemMessage},
			{Role: "user", Content: userMessage},
		},
		Stream:          false,
		Temperature:     temperature,
		MaxTokens:       maxTokens,
		ReasoningEffort: "max",
		ExtraBody:       extraBody,
	}

	jsonData, err := json.Marshal(chat)
	if err != nil {
		return "", fmt.Errorf("marshal: %w", err)
	}

	req, err := http.NewRequest(http.MethodPost, deepseekURL, bytes.NewReader(jsonData))
	if err != nil {
		return "", fmt.Errorf("create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{Timeout: 300 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("do request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("status %d: %s", resp.StatusCode, body)
	}

	if err != nil {
		return "", fmt.Errorf("read body: %w", err)
	}

	var response ChatResponseFull
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return "", fmt.Errorf("decode: %w", err)
	}

	if len(response.Choices) == 0 {
		return "", fmt.Errorf("no choices in response")
	}

	return response.Choices[0].Message.Content, nil
}

func DeepseekOneshotJSON(model string, messages []Message, temperature float64, maxTokens int) (string, error) {
	if err := godotenv.Load(); err != nil {
		return "", fmt.Errorf("load .env: %w", err)
	}

	apiKey := os.Getenv("DEEPSEEKAPIKEY")
	if apiKey == "" {
		return "", fmt.Errorf("DEEPSEEKAPIKEY not set")
	}

	extraBody := make(map[string]interface{})
	extraBody["thinking"] = map[string]string{"type": "disabled"}

	chat := &ChatTemplate{
		Model:           model,
		Messages:        messages,
		Stream:          false,
		Temperature:     temperature,
		MaxTokens:       maxTokens,
		ResponseFormat:  &ResponseFormat{Type: "json_object"},
		ReasoningEffort: "max",
		ExtraBody:       extraBody,
	}

	jsonData, _ := json.Marshal(chat)
	req, _ := http.NewRequest(http.MethodPost, deepseekURL, bytes.NewReader(jsonData))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{Timeout: 300 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("do request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("status %d: %s", resp.StatusCode, body)
	}

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("read body: %w", err)
	}
	trimmed := strings.TrimSpace(string(bodyBytes))
	if trimmed == "" {
		return "", fmt.Errorf("empty response body")
	}

	var response ChatResponse
	if err := json.Unmarshal([]byte(trimmed), &response); err != nil {
		return "", fmt.Errorf("decode: %w", err)
	}

	if len(response.Choices) == 0 {
		return "", fmt.Errorf("no choices in response")
	}
	if response.Choices[0].FinishReason == "length" {
		return "", fmt.Errorf("output truncated due to max_tokens limit (current: %d)", maxTokens)
	}
	content := response.Choices[0].Message.Content
	if strings.TrimSpace(content) == "" {
		fixedContent, _ := generateNormal(model, messages, temperature, maxTokens)
		return fixedContent, nil
	}

	return content, nil
}

func generateNormal(model string, messages []Message, temperature float64, maxTokens int) (string, error) {
	fmt.Println("failed json output, we received an empty list")

	text, err := DeepseekOneshotMemory(model, messages, 0.1, maxTokens)
	if err != nil {
		return "", fmt.Errorf("deepseek memory call failed: %w", err)
	}
	fmt.Println("converted to text succesfully:")
	fmt.Println(text)

	tools, err := ToolsToLLMString("tools/frontend_executer.json")
	if err != nil {
		return "", fmt.Errorf("tools failed to load: %w", tools)
	}
	system := `
	
	{
	    "reasoning": "your step-by-step thinking about what to do",
	    "act": "tool_name|arg1,arg2 OR finish|your_final_answer",
	}
	".
	`
	context := "I have another agent who is generating json output for me, however often times he fails and therefore i use another agent to give text output and then try to convert it to json again, you will receive that output and try to convert it to json object as per the schema and tools description "
	jsonMessages := []Message{
		{Role: "system", Content: context + "\nYou must respond in this exact JSON format:\n" + system + "\nHere are the tools schema: \n" + tools},
		{Role: "user", Content: text},
	}

	fmt.Println("Now trying to convert back to JSON")
	result, err := DeepseekOneshotJSON(model, jsonMessages, 0.1, maxTokens)
	if err != nil {
		return "", fmt.Errorf("failed to generate JSON output: %w", err)
	}

	fmt.Println("converted to json succesfully")
	fmt.Println(result)
	return result, nil
}

func DeepseekOneshotMemory(model string, memory []Message, temperature float64, maxTokens int) (string, error) {
	if err := godotenv.Load(); err != nil {
		return "", fmt.Errorf("load .env: %w", err)
	}

	apiKey := os.Getenv("DEEPSEEKAPIKEY")
	if apiKey == "" {
		return "", fmt.Errorf("DEEPSEEKAPIKEY not set")
	}

	extraBody := make(map[string]interface{})
	extraBody["thinking"] = map[string]string{"type": "enabled"}
	chat := &ChatTemplate{
		Model:           model,
		Messages:        memory,
		Stream:          false,
		Temperature:     temperature,
		MaxTokens:       maxTokens,
		ReasoningEffort: "max",
		ExtraBody:       extraBody,
	}
	jsonData, err := json.Marshal(chat)
	if err != nil {
		return "", fmt.Errorf("marshal: %w", err)
	}

	req, err := http.NewRequest(http.MethodPost, deepseekURL, bytes.NewReader(jsonData))
	if err != nil {
		return "", fmt.Errorf("create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("do request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("status %d: %s", resp.StatusCode, body)
	}

	var response ChatResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return "", fmt.Errorf("decode: %w", err)
	}

	if len(response.Choices) == 0 {
		return "", fmt.Errorf("no choices in response")
	}
	return response.Choices[0].Message.Content, nil
}

func DeepseekMemoryLoop(systemMessage string, temperature float64, maxTokens int) error {

	memory := []Message{
		{Role: "system", Content: systemMessage},
	}

	fmt.Println("I am your Deepseek assistant with memory, how may I help you?")
	reader := bufio.NewReader(os.Stdin)
	for {
		fmt.Print("You: ")
		userMessage, err := reader.ReadString('\n')
		if err != nil {
			return fmt.Errorf("read input: %w", err)
		}

		userMessage = strings.TrimSpace(userMessage)

		if userMessage == "quit" {
			break
		}

		memory = append(memory, Message{Role: "user", Content: userMessage})

		response, err := DeepseekOneshotMemory("deepseek-v4-pro", memory, temperature, maxTokens)
		if err != nil {
			return fmt.Errorf("deepseek call: %w", err)
		}
		fmt.Println("Assistant:", response)

		memory = append(memory, Message{Role: "assistant", Content: response})
	}

	return nil
}
