---
name: Web Frontend Instructions
description: When updating UIs
applyTo: apps/web/**/*.ts*
---

- Use Shadcn and Radix for new UI components
- Get icons from Lucide
- Use latest React 19 features
- Use server actions and server components instead of client state wherever possible to minimize bundle size and client code
- Reuse components whenever possible. Do not create a new component unless you are sure a suitable one does not exist.
- Avoid making any major updates outside of the scope of the request