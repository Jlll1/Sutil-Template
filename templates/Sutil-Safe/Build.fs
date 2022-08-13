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

  let runPararell p =
    p |> Seq.toArray
    |> Array.map redirect
    |> Array.Parallel.map Proc.run
    |> ignore


module Paths =
  let deploy = Path.getFullName "deploy"
  let client = Path.getFullName "src/Client"
  let server = Path.getFullName "src/Server"
  let shared = Path.getFullName "src/Shared"

  let clientTest = Path.getFullName "test/Client"
  let serverTest = Path.getFullName "test/Server"


open Helpers

let execContext = Context.FakeExecutionContext.Create false "build.fsx" [ ]
Context.setExecutionContext (Context.RuntimeContext.Fake execContext)

Target.create "clean" (fun _ ->
    Shell.cleanDir Paths.deploy
    run dotnet "fable clean --yes" Paths.client)

Target.create "install-client" (fun _ -> run npm "install" ".")

Target.create "run" (fun _ ->
    run dotnet "build" Paths.shared
    [ dotnet "watch run" Paths.server
      dotnet $"fable watch {Paths.client} --run webpack-dev-server" "." ]
    |> runPararell)

Target.create "test-client" (fun _ ->
  dotnet $"fable watch {Paths.clientTest} --run webpack-dev-server --env test" "." |> ignore)

Target.create "test-server" (fun _ ->
  dotnet "watch run" Paths.serverTest |> ignore)

open Fake.Core.TargetOperators

let dependencies = [
  "clean"
    ==> "install-client"
    ==> "run"

  "install-client"
    ==> "test-client"
]

[<EntryPoint>]
let main args =
  try
    match args with
    | [| target |] -> Target.runOrDefault target
    | _ -> Target.runOrDefault "run"
    0
  with e ->
    printfn "%A" e
    1
