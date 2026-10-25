# Texting providers: is there something cheaper than Twilio?

Research only, checked 2026-10-25. Nothing signed up, nothing built. Prices change, so check again before we pick.

## Short answer

**Use Telnyx.** It does everything we need (our own number, people texting in a photo, sending codes and match alerts) for about **30% less than Twilio**. The catch: at our small size, the difference is only a few dollars a month. The real work is the same on every provider: a one-time US sign-up check before any texts get through.

Runner-up: **Twilio**, if we ever want the easiest setup and the most how-to guides online. Switching later is easy if our code talks to texting through one small file.

## What we need

- One US phone number people can text.
- People text in a **photo + zip code** to list a board. That photo is an "MMS" (picture text), so **receiving MMS** must work.
- We send short texts: login codes and "you have a match" alerts.
- Low volume at first.

## Price comparison (US, per message, before carrier fees)

| Provider | Number / month | Send text | Get text | Get photo (MMS) | Can receive photos? | Notes |
|---|---|---|---|---|---|---|
| **Telnyx** | $1.00 | $0.004 | $0.004 | **$0.005** | Yes | Cheapest, simple pay-as-you-go |
| Plivo | $0.50 | $0.0077 | $0.0077 | $0.018 | Yes | Cheapest number, mid-price texts |
| **Twilio** | $1.15 | $0.0083 | $0.0083 | $0.0165 | Yes | Most guides and examples; priciest of the big three |
| AWS End User Messaging | $1.00 | ~$0.006 | small | unclear | Not clear | Cheap, but more setup steps and photo support is not clear |
| Sinch | $1.00 | $0.0078 | ? | ? | Yes | Built for big companies, sales-led |
| Vonage | $1.05 | $0.0086 | ? | ? | Yes | Pricier than Twilio |
| Bandwidth | on request | ~$0.006 | ? | ? | Yes | Not self-serve; for huge senders |
| Textbelt | none (shared) | paid credits | US replies only | No | No | No own number, no photos. Ruled out |

**Also considered: Google Voice.** It didn't make the cut. It has no official way for an app to send or read texts, and Google's rules ban automated messages, so the number could get shut off. It would only work as a free number someone answers by hand, for example to test whether people actually text in boards.

**Carrier fees** are added on top by AT&T, T-Mobile and Verizon. They are about the same everywhere: roughly half a cent per text and about one cent per photo text.

## Sign-up rules (same on every provider)

US carriers block texts from apps until you register. Two ways:

1. **Local number (called "10DLC"), "sole proprietor" type.** Made for individuals and hobbyists with no business tax ID.
   - Cost: about **$4 once** + **$15 once** for review, then **$2 a month**.
   - Limits: one number, under about 1,000 texts a day. Plenty for us.
   - Wait: Telnyx says it is usually approved right away after a code check. Others can take days to a few weeks.
2. **Toll-free number (800-style).** Verification is free, but takes about **1 to 3 weeks**, and texts mostly don't get through until it is approved. Number costs about $2 a month.

Pick option 1 (local number, sole proprietor). It is cheap, fits our size, and a local SoCal area code feels friendlier.

## What a month might cost

Guess: 50 boards listed by photo text, 300 texts sent, 150 texts received.

| Provider | Number + sign-up fee | Messages (with carrier fees) | **Total / month** |
|---|---|---|---|
| Telnyx | $3.00 | ~$4.20 | **~$7** |
| Plivo | $2.50 | ~$6.50 | **~$9** |
| Twilio | $3.15 | ~$6.70 | **~$10** |

Plus about $19 once for registration on any of them. There is no truly free option: trial credit runs out, and free tools can't receive photos.

## Before we build texting

- Keep all texting code behind one small "send/receive text" file, so we can switch providers without a rewrite.
- Keep using the pretend inbox on localhost until Dutch says it is time to sign up. (No accounts are made until then.)
- Need: a short "text STOP to opt out" line and a privacy page. Carriers check for these during sign-up.

## Sources

- [Twilio US SMS pricing](https://www.twilio.com/en-us/sms/pricing/us)
- [Twilio 10DLC fees](https://pages.twilio.com/10DLC-HelpArticles-WW)
- [Telnyx messaging pricing](https://telnyx.com/pricing/messaging)
- [Telnyx sole proprietor 10DLC](https://developers.telnyx.com/docs/messaging/10dlc/sole-proprietor/index)
- [Plivo US pricing](https://plivo.com/sms/pricing/us)
- [AWS End User Messaging pricing](https://aws.amazon.com/end-user-messaging/pricing)
- [Bandwidth 10DLC fee guide](https://www.bandwidth.com/blog/how-to-register-with-10dlc-to-avoid-unnecessary-costs-in-2022/)
- [Toll-free verification timing](https://www.telphiconsulting.com/blog/twilio-toll-free-verification-cost)
- [Twilio alternatives overview (Sinch, Vonage, Bandwidth)](https://textbee.dev/blog/twilio-alternatives)
- [Textbelt docs](https://docs.textbelt.com/)
