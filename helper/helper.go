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

func EditFile(path, search, replace string) (string, error) {
	// Validate inputs
	if path == "" {
		return "", fmt.Errorf("editFileByPath: empty file path")
	}
	if search == "" {
		return "", fmt.Errorf("editFileByPath: search block cannot be empty")
	}

	// Read current file content
	original, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return "", fmt.Errorf("editFileByPath: file does not exist: %s", path)
		}
		return "", fmt.Errorf("editFileByPath: failed to read %s: %v", path, err)
	}
	content := string(original)

	// Count exact occurrences of search string
	count := strings.Count(content, search)

	// Safety checks
	if count == 0 {
		return "", fmt.Errorf("editFileByPath: search block not found (exact match required) in %s", path)
	}
	if count > 1 {
		return "", fmt.Errorf("editFileByPath: ambiguous: search block appears %d times in %s. Add more context lines", count, path)
	}

	// Perform replacement
	newContent := strings.Replace(content, search, replace, 1)

	// Direct write (no backup)
	if err := os.WriteFile(path, []byte(newContent), 0644); err != nil {
		return "", fmt.Errorf("editFileByPath: failed to write file: %v", err)
	}

	return fmt.Sprintf("SUCCESS: replaced 1 occurrence in %s", path), nil
}
