---
title: "How a Network Gateway Works (and When You Need One)"
description: "A network gateway is one always-on Linux machine that routes every device pointed at it, so TVs and consoles need no app. Learn the setup steps and limits."
pubDate: 2026-11-06T12:00:00+08:00
updatedDate: 2026-11-09T10:00:00+08:00
category: gateway
term: "Network gateway"
tags: [network gateway, side router, transparent proxy, Linux, smart TV]
faq:
  - q: "Does the gateway keep working after a reboot?"
    a: "Yes. It runs as a system service on the machine and comes back on its own after a restart, so you don’t need to start it by hand."
  - q: "How do I remove the gateway if I stop using it?"
    a: "Run the uninstall command that comes with your plan. It removes the gateway without touching other services running on the same server."
  - q: "How many devices can sit behind one gateway?"
    a: "There is no device cap. All devices behind a gateway share that plan’s data, so a lot of streaming from many screens will use it up faster."
  - q: "Can different devices use different regions?"
    a: "Not behind a single gateway, which has one region. If you need a second region, buy a second plan; each resource is metered on its own, and you can buy several."
---

## What is a network gateway?

A **network gateway** is a machine on your local network that other devices use as their path out to the internet. When that machine also sends the traffic through a VPN or proxy connection, it acts as a **side router**, sometimes called a transparent proxy: the devices behind it don’t run any VPN software, because the machine in front of them does the work.

## Why not just install an app on every device?

You would, if you could. A VPN app covers the one device it runs on, which is perfect for laptops and phones. A gateway exists for the devices that can’t run an app at all, such as smart TVs and game consoles, as long as they let you change their network settings.

| | App on each device | Network gateway |
|---|---|---|
| Setup | Install and sign in on every device | Set up once, then point each device at it |
| What works | Devices with a supported operating system | Any device that lets you set a gateway and DNS |
| Choosing which apps go through | Yes, with app-level routing | No; all traffic of a device pointed at it goes through |
| What you maintain | Nothing extra | One Linux machine that has to stay on |
| If something stops | One device is affected | Every device pointed at it loses its route until you point it back |

For one computer where you want only some apps to use the connection, the AnboVPN client’s app-level routing is the better tool.

## What do you need before you start?

You need a gateway plan and a spare Linux machine that stays switched on. AnboVPN’s gateway supports Debian and Ubuntu on amd64 or arm64, and the machine can be a small server, a soft router or an idle computer. There is no router firmware, so a stock home router can’t run it. These details were checked against the AnboVPN website in November 2026.

- **A plan and a region.** A gateway uses a single region, the one you buy.
- **A Debian or Ubuntu machine** with a fixed address on your local network.
- **Root access** on that machine, because the install script must run as root.
- **Devices that let you edit network settings**, specifically the gateway and DNS fields.

## How do you set up the AnboVPN network gateway?

Install once, then point your devices at the machine. The whole job is five steps.

1. **Choose a plan.** Pick the region and billing cycle on the [network gateway page](https://www.anbolink.com/gateway). Billing is by data, with no separate gateway fee.
2. **Open your plan’s details page** and copy your own one-line install command. It already contains the connection parameters for that plan.
3. **Run it as root** on the Debian or Ubuntu machine.
4. **Point a device at it.** On the TV, console or computer, set the gateway and DNS to the machine’s local address. You can also set this once in your router’s DHCP settings, so devices pick it up automatically.
5. **Check the result.** On a device behind the gateway, run `curl https://www.anbolink.com/ip` or open the free [IP lookup tool](https://www.anbolink.com/tools/ip-lookup) and confirm the address is the one you expect.

## What are the catches?

A gateway has five catches: one region per plan, an always-on machine, all-or-nothing routing, your own maintenance and no promise of speed. None is a dealbreaker, but each deserves a sentence before you commit.

- **One region.** Every device pointed at the gateway leaves through that region.
- **Always on.** If the machine is off, devices pointed at it have no route.
- **All or nothing.** You can’t pick apps; all traffic from a device that uses the gateway goes through it.
- **You’re the sysadmin.** Updates and local network settings are yours to look after.
- **No promises on performance.** The connection depends on your network, the machine and the region. AnboVPN doesn’t promise speed, latency or uptime.

## Is a network gateway right for you?

It is right if you have an always-on Linux machine, a few devices that can’t run an app and a single region that suits all of them. If you only have one or two ordinary computers, skip the gateway and use the client.

Related reading: [HTTP vs SOCKS5 proxy](/posts/http-vs-socks5-proxy/) covers a lighter way to give a single tool its own address, and [Dedicated IP or Shared IP?](/posts/dedicated-ip-vs-shared-ip/) explains when a stable address matters.
