package workflows

import (
	"agent/deepseek"
	"agent/helper"
	"agent/prompts"
	"agent/tools"
	"fmt"
)

func VanillaFrontEnd() {
	if UMessage, err := helper.Input("Welcome to Vanilla FrontEnd Agent\n Please write your user request: "); err == nil {
		fileList := []string{"index.html", "styles.css", "script.js"}
		researchFiles, err := helper.ViewFiles(fileList)
		if err != nil {
			fmt.Println("Error when trying to view the files")
		}
		systemMsgResearch := prompts.ProjectManager
		systemMsgPlan := prompts.Teamlead

		fmt.Println("Researching........................")
		research, err := deepseek.DeepseekOneshot(systemMsgResearch, UMessage+"\n\n"+"Here are the files:\n\n"+researchFiles, 0.2, 64000)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(research)
		helper.WriteToFile("plan.md", research)

		fmt.Println("Planning........................")
		plan, err := deepseek.DeepseekOneshot(systemMsgPlan, research+"\n\n"+"Here are the files:\n\n"+researchFiles, 0.2, 64000)
		if err != nil {
			fmt.Println(err)
		}
		helper.AppendToFile("plan.md", "\n\n###Here is the step by step plan\n\n"+plan)
		fmt.Println(plan)

		ExecuterAgentRegistry := tools.FileFunctions()
		executeTools, err := deepseek.LoadToolsFromFile("tools/frontend_executer.json")
		if err != nil {
			fmt.Println("error trying to execute Tools")
		}
		agent := &deepseek.Agent{

			SystemPrompt: prompts.ExecuteAgent,
			UserPrompt:   UMessage,
			Tools:        executeTools,
			Registry:     ExecuterAgentRegistry,
			Path:         "tools/frontend_executer.json",
		}

		agent.Run()
		agent.PrintMemory()
	}
}
