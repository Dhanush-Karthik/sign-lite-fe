import { App as MyApp, View } from "framework7-react";
import { Framework7Parameters } from "framework7/types";
import useOpenid from "./core/hooks/useOpenid";
import Spinner from "./components/Spinner";
import { CALLBACK_URL } from "./constants";
import RequestSignature from "./pages/RequestSignature";
import Home from "./pages/Home";
import { Details } from "./pages/Details";
import Review from "./pages/Review";
import Recipient from "./pages/Recipient";
import { ViewDoc } from "./pages/ViewDoc";
import AddNomineeRecipient from "./pages/AddNomineeRecipient";
import AddNomineeReview from "./pages/AddNomineeReview";
import AddNomineeRequestSignature from "./pages/AddNomineeRequestSignature";
import NectSimulation from "./pages/NectSimulation/NectSimulation";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/request-signature",
    component: RequestSignature,
  },
  {
    path: "/details",
    component: Details,
  },
  { path: "/review", component: Review },
  { path: "/addNomineeReview", component: AddNomineeReview},
  { path: "/addNomineeRequestSignature", component: AddNomineeRequestSignature},
  { path: "/addNominee", component: AddNomineeRecipient},
  { path: "/recipient", component: Recipient },
  { path: "/details/viewdoc", component: ViewDoc },
];

function App() {
  const [isReady] = useOpenid();
  const f7params: Framework7Parameters = {
    name: "Sign & List", // App name
    routes, // App routes
    url: CALLBACK_URL,
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isReady ? (
            <MyApp {...f7params}>
              <View main transition="f7-parallax" />
            </MyApp>
          ) : (
            <Spinner />
          )} />
        <Route path="/nect/simulation" element={<NectSimulation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
