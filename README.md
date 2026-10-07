# Awesome Solana Builders

A curated list of tools, libraries, APIs and learning resources for people building on Solana.

Every entry is one real sentence about what the thing does. No rankings, no affiliate links, no hype. If something is here, someone checked that it works and is still maintained.

## Contents

- [RPC providers and infrastructure](#rpc-providers-and-infrastructure)
- [SDKs and frameworks](#sdks-and-frameworks)
- [Bots and trading libraries](#bots-and-trading-libraries)
- [Data APIs and indexers](#data-apis-and-indexers)
- [Token and transaction tools](#token-and-transaction-tools)
- [Security tools](#security-tools)
- [Learning resources](#learning-resources)

New entries are welcome. See [Contributing](#contributing).

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

## Bots and trading libraries

Reusable libraries and APIs for building trading and automation software. Ready-made sniper, copy-trade and arbitrage bots are not listed.

- [Jito](https://docs.jito.wtf) - Block engine and bundle service for sending atomic transaction bundles with tips, with documentation and client libraries.
- [Jupiter API](https://dev.jup.ag) - Swap and price APIs that route trades across Solana liquidity sources.
- [Meteora DLMM SDK](https://github.com/MeteoraAg/dlmm-sdk) - TypeScript SDK for reading and interacting with Meteora's dynamic liquidity market maker pools.
- [Orca Whirlpools](https://github.com/orca-so/whirlpools) - SDKs for working with Orca's concentrated liquidity pools from TypeScript and Rust.
- [Raydium SDK V2](https://github.com/raydium-io/raydium-sdk-V2) - TypeScript SDK for swaps, liquidity and farm interactions with Raydium pools.
- [Solana Agent Kit](https://github.com/sendaifun/solana-agent-kit) - Toolkit that connects AI agents to Solana protocols through a set of ready-made actions.

## Data APIs and indexers

Services and frameworks for reading, streaming and querying on-chain data beyond what plain RPC offers.

- [Birdeye](https://docs.birdeye.so) - API for Solana token prices, OHLCV candles and token discovery data.
- [Bitquery](https://bitquery.io) - Indexed and decoded Solana data such as trades and transfers, served over GraphQL, WebSocket, Kafka and gRPC.
- [Carbon](https://github.com/sevenlabs-hq/carbon) - Rust framework for building Solana indexers that connects data sources to program decoders and custom processors.
- [DexScreener API](https://docs.dexscreener.com) - Public API for token pair, price and liquidity data across Solana DEXs.
- [Dune](https://dune.com) - Platform for querying indexed Solana data with SQL and publishing the results as dashboards.
- [Yellowstone gRPC](https://github.com/rpcpool/yellowstone-grpc) - Geyser plugin that streams real-time account and transaction updates from validators over gRPC.
- [Yellowstone Vixen](https://github.com/rpcpool/yellowstone-vixen) - Rust framework that turns raw Yellowstone events into typed data through parsers and handlers.

## Token and transaction tools

Tools for creating, inspecting and managing tokens and for reading transactions.

- [Metaplex](https://developers.metaplex.com) - Standards and tooling for token metadata and NFTs on Solana, including compressed NFTs.
- [mint-check](https://github.com/switch-afk/mint-check) - Command-line tool that checks a Solana token mint for red flags (by the maintainer).
- [RugCheck](https://rugcheck.xyz) - Token scanner with an API that reports risks such as mint authority, freeze authority and holder concentration.
- [sol-tx-explain](https://github.com/switch-afk/sol-tx-explain) - Command-line tool that turns a Solana transaction signature into a plain-English summary (by the maintainer).
- [Streamflow](https://streamflow.finance) - Token vesting, locks and streaming payments, with an SDK for embedding them in your own app.
- [Token program](https://github.com/solana-program/token) - Reference implementation of Solana's original Token program that defines mints and token accounts.
- [Token-2022](https://github.com/solana-program/token-2022) - Token program that adds extensions such as transfer fees and confidential transfers while keeping the original Token program's instructions.

## Security tools

Tools for testing, verifying and protecting Solana programs.

- [Radar](https://github.com/Auditware/radar) - Static analyzer for Rust-based Solana programs that runs customizable vulnerability detectors.
- [Solana Verify](https://github.com/Ellipsis-Labs/solana-verifiable-build) - Command-line tool that builds a program reproducibly and checks that a deployed program matches its public source.
- [solana-security-txt](https://github.com/neodyme-labs/solana-security-txt) - Macro that embeds contact and disclosure details into a program binary so researchers know where to report bugs.
- [Squads](https://squads.xyz) - Multisig and smart account infrastructure for controlling program upgrade authorities and treasuries.
- [Trident](https://github.com/Ackee-Blockchain/trident) - Rust fuzzing framework for Solana programs, built and maintained by Ackee Blockchain Security.

## Learning resources

Official and community material for learning how to build on Solana.

- [Solana Cookbook](https://solana.com/developers/cookbook) - Code snippets and recipes in JavaScript and Python for common tasks such as connecting to a cluster and creating keypairs and accounts.
- [Solana Developer Courses](https://solana.com/developers/courses) - Structured courses that take you from a first program to a production application.
- [Solana documentation](https://solana.com/docs) - Official documentation covering accounts, transactions, programs, the CLI and local development.
- [Solana Playground](https://beta.solpg.io) - Browser-based editor for writing, building and deploying Solana programs without installing any tools.
- [Solana Program Examples](https://github.com/solana-developers/program-examples) - Reference programs showing common patterns, written for several frameworks.
- [Solana Stack Exchange](https://solana.stackexchange.com) - Question-and-answer site for Solana development problems.

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