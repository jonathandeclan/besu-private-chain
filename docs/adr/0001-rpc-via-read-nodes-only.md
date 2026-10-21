---
status: accepted
---

# RPC is served by Read Nodes only

Validators hold the signing keys and produce blocks, so client RPC traffic should not reach them. Once the Read Node fleet exists, the NLB and PrivateLink will target Read Nodes only and Validators will stop serving RPC. Until then the NLB still targets the Validators, because no Read Node fleet is deployed.

## Considered Options

- **Validators keep serving RPC.** Today's behaviour; simpler, but exposes key-holding nodes to client load and traffic.
- **Both serve RPC.** Rejected: it keeps that exposure and gives no clear boundary.

## Consequences

- The Read Node fleet must be built before RPC moves off the Validators.
- Each Read Node's Static Nodes File lists the Validators. Validators do not need to list Read Nodes, because they accept inbound peers.
