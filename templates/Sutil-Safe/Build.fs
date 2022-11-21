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
  let publish = Path.getFullName "src/Client/public"
  let server = Path.getFullName "src/Server"
  let shared = Path.getFullName "src/Shared"

  let clientTest = Path.getFullName "test/Client"
  let clientTestPublish = Path.getFullName "test/Client/public"
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
      dotnet $"fable watch {Paths.client} -o {Paths.publish} --run webpack-dev-server" "." ]
    |> runPararell)

Target.create "test" (fun _ ->
  [ dotnet "watch run" Paths.serverTest
    dotnet $"fable watch {Paths.clientTest} -o {Paths.clientTestPublish} --run webpack-dev-server --env test" "." ]
  |> runPararell)

open Fake.Core.TargetOperators

let dependencies = [
  "clean"
    ==> "install-client"
    ==> "run"

  "install-client"
    ==> "test"
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
