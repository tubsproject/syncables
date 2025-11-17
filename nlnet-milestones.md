# Project plan
## The Ultimate Bookkeeping System
Bookkeeping systems, databases, and computer systems in general, tend to act as a "System of Record" (SOR) in which only one truth can exist. Recent trends in local-first software development, as well as traditional distributed computation theory study networks in which these SORs act as nodes that send each other updates. Data in such a network of SORs is fundamentally multi-homed: it does not live "at" a URL in the way Linked Data does, but in multiple places at the same time.
This project will develop new tools for interconnecting systems of record, such as an application called "Reflector" (which copies data from one API to an other API), a schema transformation library called "Devonian" (a proposed successor to the Cambria Project from Ink & Switch), and an extension to the Open API spec called "Syncables".
We will also build three small software components for the LetsPeppol service that we are (still) setting up, and two domain-specific parts of the ultimate bookkeeping system, namely business documents and social networking.

# 1. Syncables
By defining the 'syncables' of an API in an Open API Document or in an Open API Overlay, an API provider can specify how sync engines can pull and push a full local-first copy of a data object or data collection. In this milestone we will define this extension of the Open API specification, and provide a reference implementation of a sync engine that can work with syncables.
Milestone(s)
	a.	Read-only version (€ 5000)
	b.	Full bidirectional version (€ 5000)

# 2. Devonian
Devonian will be a software library that can connect two database tables in potentially two different databases, making sure that cells and identifiers are translated between the two schemas.
To use it, indicate which field is the primary key on each side, and provide a JavaScript function that translates one database row into the other or vice versa, possibly consulting related database tables. Devonian will take care of the rest.
Using CRDT technology, Devonian will also attempt to handle concurrent updates across schemas, which is quite an advance research topic at present in the community around Local First and Braid.
Milestone(s)
	a.	Devonian 1.0 version (€ 10000)

# 3. Reflector
The reflector is a server-side hosted application that connects to two APIs (for instance GitLab Issues + NextCloud Tasks) and receives webhooks, using Syncables to create a copy of the syncable collection exposed by each API, and using Devonian to translate between the two.
Milestone(s)
	a.	Reflector 1.0 version (€ 5000)

# 4. Full domain-specific tubs instances
Using Syncables, Devonian and Reflector as core components, these tubs instances will sync multi-homed data in specific domains. The example applications and the components to bring TUBS in practice will have a GUI, and we will request accessibility help at that point.
Milestone(s)
	a.	Connecting LetsPeppol invoices data with bank transactions data. (€ 5000)
	b.	Multi-Homed Timesheets and Task Tracking (€ 5000)

# 5. Software Components for bringing TUBS into practice
Belgium is making mandatory for B2B transactions to use the new Peppol protocol. However, no Open-Source endpoints have been proposed yet. In this part of the project, we apply components of TUBS to develop an open and free (self-hostable) invoicing system that complies with KYC requirements.
Linked to the multi-homed bookkeeping ledgers, we need a few specific open source software components for the "LetsPeppol.org" free e-invoicing service we are launching. This is a collaboration between Michiel de Jong from TUBS and Wout Swinkels and Bart Stukken from SoftwareOplossing.be. The results will be open-source and self-hostable, thus easily reusable.
Milestone(s)
	a.	API proxy, for instance for a Peppol AP, authenticates the users and forwards API requests with our reseller credentials added (€ 5000)
	b.	Hostable KYC mechanism for Belgian VAT numbers (€ 5000)
	c.	Invoicing application that uses the TUBS to provide basic sending and receiving of invoices for small businesses. (€ 5000)