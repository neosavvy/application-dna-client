# Application DNA

The purpose of this repository is to get the basics of an application dna
project moving quickly. It is based on a series of blog posts that are hosted 
here: https://adamparrish.xyz/series/scalable-python-arch

# Notes on Supabase

We are using Supabase as a replacement for other closed source realtime push 
libraries. The benefits of supabase are

1. Self-hostable - so if you work in an environment where using SaaS/PaaS environments is a non-starter, this gives ou the benefits of realtime push without having to build it yourself. 
2. Auth/StorageAPI/Webhooks and Cloud Functions - in the event that you have to worry about cloud-agnosticism and fluidity of movement between clouds, this will scratch that itch. Your vendor lockin will be to Supabase, and as long as you work using Docker compose, then you can move to any cloud provider that supports Docker or K8s.

## Real Time Listening

We followed the guide here to monitor basic PostgreSQL Profile Changes.

https://supabase.com/docs/guides/realtime/extensions/postgres-changes

This is of course a very contrived example, but if you need to setup listeners, it will prove you are operational before you focus on your use case. 

## Server Side Synchronous and Asynchronous (via Queue) Updates

There are many cases where your architecture will dictate that you have a server side update that should PUSH to the client. Sometimes this can happen as a result of a REST-ful call and before the end of that invocation the data can be pushed to Supabase and reflected via the websocket update. 
There are other cases where a long running task may need to update data in your Supabase data store and be reflected on the client. We have two examples of just such a case wired to our [Server](https://github.com/neosavvy/application-dna-server) and [Infrastructure](https://github.com/neosavvy/application-dna-self-hosted-infra)


