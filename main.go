package main

import (
	"agent/deepseek"
	"agent/helper"
	"agent/prompts"
	"agent/workflows"
	"fmt"
)

func main() {
	for {
		input, err := helper.Input("Ego AI initiated\nPlease enter a command:\n")
		if err != nil {
			fmt.Println("Error reading input:", err)
			continue
		}

		switch input {
		case "frontend":
			workflows.VanillaFrontEnd()

		case "chat":
			err := deepseek.DeepseekMemoryLoop(prompts.BackendAssistant, 0.3, 4500)
			if err != nil {
				fmt.Println("chat error:", err)
			}
		case "q":
			fmt.Println("Exiting...")
			return
		default:
			fmt.Println("please enter the correct command")
		}
	}
}
