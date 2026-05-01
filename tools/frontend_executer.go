package tools

import (
	"fmt"
	"os"
	"path/filepath"
)

func FileFunctions() map[string]func(string) (string, error) {
	return map[string]func(string) (string, error){
		"analyze_plan": AnalyzePlan,
		"analyze_html": AnalyzeHtml,
		"analyze_css":  AnalyzeCss,
		"analyze_js":   AnalyzeJS,
		"update_html":  UpdateHTML,
		"update_css":   UpdateCSS,
		"update_js":    UpdateJS,
	}
}

// AnalyzeHtml reads and returns the content of index.html
func AnalyzePlan(args string) (string, error) {
	path := "plan.md"
	content, err := os.ReadFile(path)
	if err != nil {
		return "", fmt.Errorf("analyze_html: failed to read %s: %v", path, err)
	}
	fmt.Println("analyze_plan tool called")
	return string(content), nil
}

// AnalyzeHtml reads and returns the content of index.html
func AnalyzeHtml(args string) (string, error) {
	path := "index.html"
	content, err := os.ReadFile(path)
	if err != nil {
		return "", fmt.Errorf("analyze_html: failed to read %s: %v", path, err)
	}
	fmt.Println("analyze_html tool called")
	return string(content), nil
}

// AnalyzeCss reads and returns the content of styles.css
func AnalyzeCss(args string) (string, error) {
	path := "styles.css"
	content, err := os.ReadFile(path)
	if err != nil {
		return "", fmt.Errorf("analyze_css: failed to read %s: %v", path, err)
	}
	fmt.Println("analyze_css tool called")
	return string(content), nil
}

// AnalyzeJS reads and returns the content of script.js
func AnalyzeJS(args string) (string, error) {
	path := "script.js"
	content, err := os.ReadFile(path)
	if err != nil {
		return "", fmt.Errorf("analyze_js: failed to read %s: %v", path, err)
	}
	fmt.Println("analyze_js tool called")
	return string(content), nil
}

// updateHTML writes content to index.html (creates or overwrites)
// args format: "content"
func UpdateHTML(args string) (string, error) {
	path := "index.html"
	content := args

	dir := filepath.Dir(path)
	if dir != "." && dir != "/" {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return "", fmt.Errorf("update_html: failed to create directory: %v", err)
		}
	}

	err := os.WriteFile(path, []byte(content), 0644)
	if err != nil {
		return "", fmt.Errorf("update_html: failed to write file: %v", err)
	}

	fmt.Println("update_html tool called")
	return fmt.Sprintf("Successfully wrote %d bytes to %s", len(content), path), nil
}

// updateCSS writes content to styles.css (creates or overwrites)
// args format: "content"
func UpdateCSS(args string) (string, error) {
	path := "styles.css"
	content := args

	dir := filepath.Dir(path)
	if dir != "." && dir != "/" {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return "", fmt.Errorf("update_css: failed to create directory: %v", err)
		}
	}

	err := os.WriteFile(path, []byte(content), 0644)
	if err != nil {
		return "", fmt.Errorf("update_css: failed to write file: %v", err)
	}

	fmt.Println("update_css tool called")
	return fmt.Sprintf("Successfully wrote %d bytes to %s", len(content), path), nil
}

// updateJS writes content to script.js (creates or overwrites)
// args format: "content"
func UpdateJS(args string) (string, error) {
	path := "script.js"
	content := args

	dir := filepath.Dir(path)
	if dir != "." && dir != "/" {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return "", fmt.Errorf("update_js: failed to create directory: %v", err)
		}
	}

	err := os.WriteFile(path, []byte(content), 0644)
	if err != nil {
		return "", fmt.Errorf("update_js: failed to write file: %v", err)
	}

	fmt.Println("update_js tool called")
	return fmt.Sprintf("Successfully wrote %d bytes to %s", len(content), path), nil
}
