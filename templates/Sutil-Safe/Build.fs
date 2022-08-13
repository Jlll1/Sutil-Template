// Based on https://safe-stack.github.io/docs/recipes/build/add-build-script/

open Fake.Core
open Fake.IO
open System

module Helpers =
  let redirect createProcess =
    createProcess
    |> CreateProcess.redirectOutputIfNotRedirected
    |> CreateProcess.withOutputEvents Console.WriteLine Console.WriteLine

  let createProcess exe arg dir =
    CreateProcess.fromRawCommandLine exe arg
    |> CreateProcess.withWorkingDirectory dir
    |> CreateProcess.ensureExitCode

  let dotnet = createProcess "dotnet"

  let npm =
    let npmPath =
      match ProcessUtils.tryFindFileOnPath "npm" with
      | Some path -> path
      | None -> failwith "npm was not found in path."
    createProcess npmPath

  let run proc arg dir =
    proc arg dir
    |> Proc.run
    |> ignore


module Paths =
  let sharedPath = Path.getFullName "src/Shared"
  let serverPath = Path.getFullName "src/Server"
  let clientPath = Path.getFullName "src/Client"
  let deployPath = Path.getFullName "deploy"


open Helpers

let execContext = Context.FakeExecutionContext.Create false "build.fsx" [ ]
Context.setExecutionContext (Context.RuntimeContext.Fake execContext)

Target.create "Clean" (fun _ ->
    Shell.cleanDir Paths.deployPath
    run dotnet "fable clean --yes" Paths.clientPath)

Target.create "InstallClient" (fun _ -> run npm "install" ".")

Target.create "Run" (fun _ ->
    run dotnet "build" Paths.sharedPath
    [ dotnet "watch run" Paths.serverPath
      dotnet $"fable watch {Paths.clientPath} --run webpack-dev-server" "." ]
    |> Seq.toArray
    |> Array.map redirect
    |> Array.Parallel.map Proc.run
    |> ignore)

open Fake.Core.TargetOperators

let dependencies = [
  "Clean"
    ==> "InstallClient"
    ==> "Run"
]

[<EntryPoint>]
let main args =
  try
    match args with
    | [| target |] -> Target.runOrDefault target
    | _ -> Target.runOrDefault "Run"
    0
  with e ->
    printfn "%A" e
    1
