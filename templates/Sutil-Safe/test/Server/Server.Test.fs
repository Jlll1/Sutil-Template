module Server.Tests

open Expecto

let serverTests = testList "Server" [
  testCase "getAdjective returns correct value" <| fun _ ->
    let validAdjectives = [ "cool" ; "fun" ; "fresh" ; "hip" ]

    let result = Server.getAdjective ()

    Expect.contains validAdjectives result "returned adjective should be in range of correct values"
]

[<EntryPoint>]
let main _ = runTestsWithCLIArgs [] [||] serverTests
