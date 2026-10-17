import React, { lazy, Suspense, useEffect, useState } from "react";
import { openSource } from "../../portfolio";
import Contact from "../contact/Contact";
import Loading from "../loading/Loading";
import { githubGraphQL } from "../../lib/github";

const GithubProfileCard = lazy(() => import("../../components/githubProfileCard/GithubProfileCard"));

const profileQuery = (login) => `
  {
    user(login: "${login}") {
      name
      bio
      isHireable
      avatarUrl
      location
    }
  }
`;

const showGithubProfile = () => openSource.display && openSource.showGithubProfile === "true";

export default function Profile() {
  const [prof, setProf] = useState([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!showGithubProfile()) return undefined;
    let alive = true;
    githubGraphQL(profileQuery(openSource.githubUserName), openSource.githubConvertedToken)
      .then((data) => {
        if (alive) setProf(data.user);
      })
      .catch((error) => {
        console.error(error);
        console.error("Because of this Error Contact Section is Showed instead of Profile");
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (showGithubProfile() && !failed) {
    return (
      <Suspense fallback={<Loading />}>
        <GithubProfileCard prof={prof} key={prof.id} />
      </Suspense>
    );
  }
  return <Contact />;
}
