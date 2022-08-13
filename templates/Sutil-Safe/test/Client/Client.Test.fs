module Client.Test

open Index
open Fable.Mocha

let clientTests = testList "Client" [
  testCase "AdjectiveChanged" <| fun _ ->
    let expectedAdjective = "TestAdjective"
    let model, _ = init ()

    let model, _ = update (AdjectiveChanged expectedAdjective) model

    Expect.equal model.Adjective expectedAdjective "Model should be updated with new value"
]

[<EntryPoint>]
let main _ = Mocha.runTests clientTests

