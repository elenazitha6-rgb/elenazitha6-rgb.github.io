---
title: "Network Gateway Explained: Cover Devices Without Apps"
description: "A network gateway (side router) routes every device that points to it through one connection, so TVs and consoles need no app. See how it works and its limits."
pubDate: 2026-11-06T12:00:00+08:00
category: gateway
tags: [network gateway, side router, transparent proxy, Linux, home network]
faq:
  - q: "Do I need to install an app on every device behind the AnboVPN network gateway?"
    a: "No. Devices behind the gateway need no client. They do need to be set up to use it, by pointing their gateway and DNS settings at the machine that runs it."
  - q: "Can I install the network gateway on my router?"
    a: "There is no router firmware or router app. The gateway installs on a Debian or Ubuntu Linux machine (amd64 or arm64), such as a server, a soft router or an idle PC, with a one-line command run as root."
  - q: "Can I switch regions on a network gateway?"
    a: "No. A gateway uses a single region, which is the one you buy. If you need a different region, you need a plan for that region."
  - q: "Is a network gateway the same thing as a transparent proxy?"
    a: "They describe the same idea from two angles. A transparent proxy handles traffic without each device being configured with proxy settings, and a gateway is the network role that makes that possible."
---

## What is a network gateway (side router)?

A **network gateway** is a machine on your local network that other devices use as their path to the internet. When it also routes that traffic through a VPN or proxy connection, it works as a **side router**, also called a transparent proxy: the devices behind it do not need a VPN app because the machine in front of them does the work.

## How is a network gateway different from installing a VPN app?

A VPN app protects the one device it runs on. A network gateway covers every device that is set to use it, whatever its operating system. The trade-off is that you maintain one more machine.

| | VPN app on each device | Network gateway |
|---|---|---|
| Setup | Install and sign in on every device | Install once, then point each device at it |
| Devices that work | Those with a supported operating system | Any device that lets you set a gateway and DNS |
| Per-device control | App-level routing on each device | All traffic of the devices that use it |
| Machine you maintain | None | One Linux machine that must stay on |
| If it stops | Only that device is affected | Devices pointed at it lose their route until you switch them back |

If you want to choose which apps use the connection on a single computer, the AnboVPN client's app-level routing and TUN mode do that. The gateway is for the devices that cannot run a client.

## What do you need to set up the AnboVPN network gateway?

You need a gateway plan and a Debian or Ubuntu Linux machine (amd64 or arm64) that stays on, such as a small server, a soft router or an idle PC. The AnboVPN gateway installs with a one-line command run as root. There is no router firmware or router app. These details were checked against the AnboVPN website in November 2026.

1. **Choose a plan and region.** The gateway uses a single region, the one you buy, so pick it with care. See the [network gateway page](https://www.anbovpn.com/gateway) for what is on sale.
2. **Prepare the machine.** A Debian or Ubuntu system with a fixed address on your local network.
3. **Run the install command.** Copy the one-line command shown for your plan in your account and run it as root on that machine.
4. **Point a device at it.** On the device, or in your router's DHCP settings, set the gateway and DNS to the machine's local address.
5. **Verify.** Check the device's public address with `curl https://www.anbovpn.com/ip` or the free [IP lookup tool](https://www.anbovpn.com/tools/ip-lookup).

## Which devices benefit most from a gateway?

Devices that cannot run a VPN client but do let you change their network settings benefit most. That includes smart TVs, game consoles and some media players. Anything on the same local network that you point at the gateway gets the same connection, so one setup can serve several people and devices.

## What are the limits of a network gateway?

A gateway is simple but not free of trade-offs. Know these before you commit:

- **One region.** Every device pointed at the gateway leaves through the same region. You cannot switch region per device.
- **Always on.** The machine must stay powered and connected. When it is off, the devices pointed at it have no route.
- **All-or-nothing routing.** All traffic of a device that uses the gateway goes through it. For per-app choices on one computer, use the client instead.
- **You maintain it.** Updates and the local network settings are your responsibility.
- **No speed promise.** The connection depends on your network, the machine and the region, and AnboVPN does not promise speed, latency or uptime.

Related reading: [Dedicated IP vs shared IP](/posts/dedicated-ip-vs-shared-ip/) explains when a fixed address matters, and [HTTP vs SOCKS5 proxy](/posts/http-vs-socks5-proxy/) covers a lighter-weight way to use a fixed address for a single tool.
