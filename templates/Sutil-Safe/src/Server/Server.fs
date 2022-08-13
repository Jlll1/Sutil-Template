open Fable.Remoting.Giraffe
open Fable.Remoting.Server
open Saturn
open Shared

let adjectivesApi : IAdjectivesApi = {
  getAdjective = fun () ->
    async {
      let adjectives = [ "cool" ; "fun" ; "fresh" ; "hip" ]
      return adjectives[(System.Random().Next adjectives.Length)]
    }
  }

let webApp =
  Remoting.createApi ()
  |> Remoting.withRouteBuilder Route.builder
  |> Remoting.fromValue adjectivesApi
  |> Remoting.buildHttpHandler

let app =
  application {
    url "http://*:8085"
    use_router webApp
  }

run app
