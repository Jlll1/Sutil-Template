namespace Shared

type IAdjectivesApi =
  { getAdjective : unit -> Async<string> }

module Route =
  let builder t m = $"/api/{t}/{m}"
