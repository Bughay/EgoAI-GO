package main

import (
	"agent/helper"
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
		case "backend":
			fmt.Println("Backend soon")
		case "q":
			fmt.Println("Exiting...")
			return // exits main cleanly
		default:
			fmt.Println("please enter the correct command")
		}
	}
}
