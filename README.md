# Awesome Solana Builders

A curated list of tools, libraries, APIs and learning resources for people building on Solana.

Every entry is one real sentence about what the thing does. No rankings, no affiliate links, no hype. If something is here, someone checked that it works and is still maintained.

## Contents

- [RPC providers and infrastructure](#rpc-providers-and-infrastructure)
- [SDKs and frameworks](#sdks-and-frameworks)

Categories are added one pull request at a time.

## RPC providers and infrastructure

Services that give your code a connection to the Solana network.

- [Alchemy](https://www.alchemy.com/solana) - Multi-chain node provider that includes Solana RPC alongside its data APIs and webhooks.
- [Helius](https://www.helius.dev) - Solana-only provider with RPC, enhanced token and NFT APIs, webhooks and a priority fee estimation endpoint.
- [Ironforge](https://www.ironforge.cloud) - Management layer that sits in front of your existing RPC providers instead of being a provider itself.
- [OrbitFlare](https://orbitflare.com) - Solana provider offering RPC, WebSocket and Yellowstone-compatible gRPC endpoints.
- [QuickNode](https://www.quicknode.com/chains/sol) - Multi-chain node provider that offers Solana among dozens of networks, useful if you also need EVM endpoints from one vendor.
- [RPC Fast](https://rpcfast.com) - Solana RPC provider selling dedicated nodes for latency-sensitive workloads.
- [Solana public RPC endpoints](https://solana.com/docs/references/clusters) - Free public endpoints for each cluster that are rate-limited, so they suit testing and not production.
- [Syndica](https://syndica.io) - Solana-focused provider offering RPC and streaming with an enterprise orientation.
- [Triton One](https://triton.one) - Solana infrastructure company that maintains the Yellowstone gRPC streaming interface and sells dedicated nodes.

## SDKs and frameworks

Libraries and frameworks for writing programs and the clients that talk to them.

- [Anchor](https://www.anchor-lang.com) - Rust framework for writing, testing and deploying Solana programs, with IDL generation and a TypeScript client.
- [Codama](https://github.com/codama-idl/codama) - Generates typed JavaScript and Rust clients from a Solana program's IDL.
- [Framework Kit](https://github.com/solana-foundation/framework-kit) - Solana Foundation packages built on Solana Kit that provide a client and React hooks for wallets, balances and transactions.
- [Pinocchio](https://github.com/anza-xyz/pinocchio) - Rust library with no external dependencies for writing Solana programs with zero-copy account access.
- [Solana Kit](https://solanakit.com) - JavaScript and TypeScript SDK for Solana RPC, signing and transactions that replaces the class-based web3.js v1.
- [Solana Program clients](https://github.com/solana-program) - GitHub organization with typed JavaScript and Rust clients for core programs such as System, Token and Token-2022.
- [solana-go](https://github.com/gagliardetto/solana-go) - Go SDK for Solana RPC and WebSocket clients and transaction building.
- [solana-py](https://github.com/michaelhly/solana-py) - Python SDK for Solana RPC clients and transaction building.
- [Wallet Adapter](https://github.com/anza-xyz/wallet-adapter) - TypeScript packages for connecting wallets to Solana web apps, with React components.

## How entries are chosen

An entry has to be:

- **Real and working.** The link goes to something that exists and runs.
- **Maintained.** For code, a commit or release in the last 12 months. For services, still operating.
- **Useful to builders.** It solves a concrete problem for people writing software on Solana.
- **Plainly described.** One factual sentence, without marketing words.

Token and memecoin promotions, referral links, affiliate links and paid placements are not accepted.

Each entry looks like this, and entries are alphabetical within a category:

```
- [Name](https://example.com) - What it does, in one sentence.
```

The maintainer builds Solana tools too. Those are listed on the same terms as everyone else's, in alphabetical order, and marked "(by the maintainer)". The linter refuses the entry without that mark.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md), then open a pull request. `npm run lint` checks the format, alphabetical order, duplicates and wording before you push, and a link checker runs on every pull request and every Monday so dead links get caught.

## License

[CC0 1.0](LICENSE): do what you like with this list.