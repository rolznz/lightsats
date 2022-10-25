import {
  Button,
  Link,
  Loading,
  Row,
  Spacer,
  Text,
  User as NextUIUser,
} from "@nextui-org/react";
import { User } from "@prisma/client";
import { NewTipButton } from "components/tipper/NewTipButton";
import { Tips } from "components/tipper/Tips";
import { DEFAULT_NAME } from "lib/constants";
import { Routes } from "lib/Routes";
import { defaultFetcher } from "lib/swr";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import NextLink from "next/link";
import useSWR from "swr";

const Home: NextPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  // console.log("session", session);
  const { data: user } = useSWR<User>(
    session ? `/api/users/${session.user.id}` : null,
    defaultFetcher
  );

  if (sessionStatus === "loading") {
    return <Loading type="spinner" color="currentColor" size="sm" />;
  }

  return (
    <>
      <Head>
        <title>Lightsats⚡</title>
      </Head>

      {session ? (
        <>
          <Row justify="center" align="center">
            <NextUIUser
              src={user?.avatarURL ?? undefined}
              name={user?.name ?? DEFAULT_NAME}
            />
            <NextLink href={Routes.profile}>
              <a>
                <Button color="secondary" size="xs">
                  Profile
                </Button>
              </a>
            </NextLink>
            <Spacer x={0.5} />
            <NextLink href={Routes.scoreboard}>
              <a>
                <Button color="success" size="xs">
                  Scoreboard
                </Button>
              </a>
            </NextLink>
          </Row>
          <Spacer y={1} />
          <Text color="error" size="small" b>
            BETA - PLEASE ONLY TIP AMOUNTS YOU ARE WILLING TO LOSE!
          </Text>
          <Spacer y={1} />
          <NewTipButton />
          <Spacer />
          <Tips />
          <Spacer y={4} />
          <Text>Received a gift?</Text>
          <NextLink href={Routes.withdraw} passHref>
            <Link color="success">withdraw claimed gifts</Link>
          </NextLink>
        </>
      ) : (
        <>
          <Spacer />
          <Text h3>
            Gift Sats without
            <br />
            losing them✌🏼
          </Text>
          <Spacer />
          <NextLink href={Routes.lnurlAuthSignin}>
            <a>
              <Button>Login with LNURL⚡</Button>
            </a>
          </NextLink>
          {<Spacer />}
          <NextLink href={Routes.emailSignin}>
            <a>
              <Button>Login with Email</Button>
            </a>
          </NextLink>
        </>
      )}
    </>
  );
};

export default Home;
