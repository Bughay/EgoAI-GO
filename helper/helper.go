package helper

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func Input(prompt string) (string, error) {
	fmt.Print(prompt)
	reader := bufio.NewReader(os.Stdin)
	text, err := reader.ReadString('\n')
	if err != nil {
		return "", err
	}
	return strings.TrimSpace(text), nil
}

func ViewFiles(fileList []string) (string, error) {

	var result strings.Builder

	for _, filename := range fileList {
		content, err := os.ReadFile(filename)
		if err != nil {
			return "", fmt.Errorf("analyze_files: failed to read %s: %v", filename, err)
		}

		result.WriteString(fmt.Sprintf("=== %s ===\n", filename))
		result.WriteString(string(content))
		result.WriteString("\n\n")
	}

	fmt.Println("analyze_files tool called")
	return result.String(), nil
}

func WriteToFile(filepath string, content string) (string, error) {
	err := os.WriteFile(filepath, []byte(content), 0644)
	if err != nil {
		return "", fmt.Errorf("write_file: failed to write %s: %w", filepath, err)
	}
	return fmt.Sprintf("Successfully wrote %d bytes to %s", len(content), filepath), nil
}

// AppendToFile appends text to a file (creates it if missing).
func AppendToFile(filepath string, content string) (string, error) {
	f, err := os.OpenFile(filepath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return "", fmt.Errorf("append_file: failed to open %s: %w", filepath, err)
	}
	defer f.Close()

	n, err := f.WriteString(content)
	if err != nil {
		return "", fmt.Errorf("append_file: failed to write %s: %w", filepath, err)
	}
	return fmt.Sprintf("Successfully appended %d bytes to %s", n, filepath), nil
}
