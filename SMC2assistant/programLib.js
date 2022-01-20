var programLib = {"smcOS": "@aluB = #1\n@aluMode = #0\n@aluA = $@editLine\n@userIO = $@aluOut\n@aluMode = %00010000\n@editLine = $@userIO\n@userIO = var editLine;$#35\n@aluMode = %00010000\n$@editLine = $@userIO\n@jump = #20",
                  "tinyOS": "@userIO = var lineToEdit;#28\n@aluMode = %00010000\n@lineToEdit = $@userIO\n@aluMode = %00010000\n$@lineToEdit = $@userIO\n@jump = #16",
                  "counter": "@aluB = #1\n@aluMode = #0\n@userIO = $@aluOut\n@aluA = $@aluOut\n@jump = #20"}
