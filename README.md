# Code Train

*Proof of Concept for an experimental, decentralized LMS (Learning Management System)*

See [the gist](https://gist.github.com/lemonteaa/7eff8f38362e63922272f50e136e43db) for the project plan/design document.

## Description

A web app that leverages [Stack/Hiro](https://www.hiro.so/) (formerly Blockstack), IPFS, and the [Hive blockchain](https://hive.io/) to implement some LMS functionalities without having to use a backend. (You can think of it as *borrowing other people's backend*)

Functions:

- [x] Course Reader
- [x] Course Catalog (Hive + elasticlunr.js)
- [x] Bookmarks
- [x] Daily Goal
- [ ] Cloud sync of user data
- [ ] Import/Export user data
- [ ] Notes + notes sharing
- [ ] Integrate with Akash to provide integrated "Cloud Shell"

## How it works

A course is a set of markdown files together with a `manifest.json` file at the root directory that contains course metadata as well as table of content linking to the files. The whole set of file is added to the IPFS network to make it publicly available. To make content discoverable, we leverage the fact that posts on Hive (a decentralized forum/social platform) can contain arbitrary json metadata - a post containing specific tags should be submitted, with the json containing course info (together with the IPFS CID/Hash of the course content - i.e. a "link"). To assist in "verified author", a circular/mutual link scheme is used - the `manifest.json` file itself should contain the permalink of the Hive post too.

The frontend read the content from IPFS and display the markdown to the end user. LMS functions like bookmarks, daily goal, etc, are implemented purely on client-side using `Indexed DB` (We use the Dexie.js library)


## Usage

First, run a local Hive testnet:

`docker run -d -p 8090:8090 inertia/tintoy:latest`
(Or `kubectl run <name> --image inertia/tintoy:latest`, then use the standard k8s port-forward command if you use k8s)

Wait for some moment for it to warm up.

Shell into the container, and run the following to get the keys for the admin user `tnman`:

`get_dev_key tintoy owner-tnman active-tnman posting-tnman memo-tnman | jq` (You only need to do this once as the key are always the same since it is from a snapshot)

Submit some course using the course-editor.

Run this app (it is a `create-react-app`, so use `npm run start`) and enjoy!

(Two sample course (You will have to recreate the Hive post):
- QmXFnKtCg5hr9J8Uc8XLrtc7Jue7EGNQ4zkjfeN6L9W54h
- QmRnC2BPCgPg5fFf3a2YriqiCv6aq8dU1EfLxh87FsZTqU
)

## Future Plan

Akash is a (paid) decentralized cloud provider that lets you run docker container. We will reference https://github.com/spacepotahto/akash-deploy-ui for the integration to let user deploy a cloud shell using their money. The app will be an ubuntu container with a sidecar that proxy requests to provide a web shell. A `code-server` component should also be included for the IDE experience. Furthermore, the endpoint should be protected by being authenticated. We plan to use https://www.ory.sh/oathkeeper/docs/pipeline/authn#jwt for this purpose (Generate a JWK key pair on client side, store them on Stack/Hiro which provides both user-private and public storage, then sign JWT on client side)

