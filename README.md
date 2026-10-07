# Awesome Solana Builders

A curated list of tools, libraries, APIs and learning resources for people building on Solana.

Every entry is one real sentence about what the thing does. No rankings, no affiliate links, no hype. If something is here, someone checked that it works and is still maintained.

## Contents

- [RPC providers and infrastructure](#rpc-providers-and-infrastructure)

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