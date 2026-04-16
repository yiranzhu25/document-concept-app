// Full extraction data for task-1: Review PSA — State Street / Federated Services

export type IssueLevel = 'critical' | 'warning' | 'info' | null

export interface Citation {
  id: string
  documentId: string
  documentName: string
  page: number
  sectionRef: string
  excerpt: string        // verbatim paragraph text from documentText.ts
  relevance: 'relevant' | 'irrelevant'
  userAdded?: boolean
}

export interface ClauseField {
  id: string
  label: string
  value: string
  issueLevel: IssueLevel
  issueFlag?: string
  sectionRef?: string
  aiReasoning: string
  citations: Citation[]
  resolved: boolean
  resolvedBy?: string
  resolvedAt?: string
}

export interface ClauseSection {
  id: string
  title: string
  fields: ClauseField[]
}

export interface TaskDocument {
  id: string
  name: string
  type: 'Main' | 'Supporting'
  size: string
  uploaded: string
}

export type AuditType = 'system' | 'human-verify' | 'human-edit' | 'comment'

export interface AuditEntry {
  id: string
  type: AuditType
  actor: string
  action: string
  detail?: string
  timestamp: string
}

// ─── Clause sections ─────────────────────────────────────────────────────────

export const CLAUSE_SECTIONS: ClauseSection[] = [
  {
    id: 'deal-terms',
    title: 'Deal Terms',
    fields: [
      {
        id: 'f-purchase-price',
        label: 'Purchase Price',
        value: '$42,500,000',
        issueLevel: null,
        sectionRef: '§2.2',
        aiReasoning: 'This value was extracted from Section 2.2 of the Agreement. The clause explicitly states "the aggregate purchase price for the Acquired Assets shall be Forty-Two Million Five Hundred Thousand Dollars ($42,500,000)." No ambiguity or conflicting purchase price references were identified in the surrounding provisions or in the Earnest Money or Adjustment sections.',
        citations: [
          {
            id: 'cit-pp-1',
            documentId: 'doc-1',
            documentName: 'PSA_StateStreet_Federated_2024.pdf',
            page: 4,
            sectionRef: '§2.2',
            excerpt: 'The aggregate purchase price for the Acquired Assets shall be Forty-Two Million Five Hundred Thousand Dollars ($42,500,000) (the "Purchase Price"), subject to adjustment as provided in Section 2.6. The Purchase Price represents the fair market value of the Acquired Assets as agreed between the Parties following arms-length negotiation.',
            relevance: 'relevant',
          },
        ],
        resolved: false,
      },
      {
        id: 'f-closing-date',
        label: 'Closing Date',
        value: 'March 15, 2024',
        issueLevel: null,
        sectionRef: '§2.5',
        aiReasoning: 'The Closing Date was extracted from Section 2.5 of the Agreement. The clause provides an unambiguous date of March 15, 2024 at 10:00 a.m. Eastern Time. A cross-reference check confirmed that this date is consistent with all other timeline references in the Agreement, including the Earnest Money Deposit and Purchase Price Adjustment provisions.',
        citations: [
          {
            id: 'cit-cd-1',
            documentId: 'doc-1',
            documentName: 'PSA_StateStreet_Federated_2024.pdf',
            page: 5,
            sectionRef: '§2.5',
            excerpt: 'The closing of the transactions contemplated by this Agreement (the "Closing") shall take place on March 15, 2024, at 10:00 a.m. Eastern Time, at the offices of Seller\'s counsel, or at such other time and place as the parties may agree in writing. All transactions at the Closing shall be deemed to occur simultaneously and no transaction shall be deemed to have been completed until all transactions are completed.',
            relevance: 'relevant',
          },
        ],
        resolved: false,
      },
      {
        id: 'f-earnest-money',
        label: 'Earnest Money Deposit',
        value: '$2,125,000 (5% of purchase price)',
        issueLevel: null,
        sectionRef: '§2.3',
        aiReasoning: 'The Earnest Money Deposit amount was extracted from Section 2.3. The clause states the deposit is "$2,125,000, representing five percent (5%) of the Purchase Price." This aligns precisely with five percent of the $42,500,000 Purchase Price, confirming the calculation is internally consistent. The deposit is held in escrow per the attached Escrow Agreement.',
        citations: [
          {
            id: 'cit-em-1',
            documentId: 'doc-1',
            documentName: 'PSA_StateStreet_Federated_2024.pdf',
            page: 4,
            sectionRef: '§2.3',
            excerpt: 'Concurrently with the execution of this Agreement, Buyer shall deposit Two Million One Hundred Twenty-Five Thousand Dollars ($2,125,000), representing five percent (5%) of the Purchase Price (the "Earnest Money Deposit"), with the Escrow Agent. The Earnest Money Deposit shall be held in escrow pursuant to the terms of the Escrow Agreement and shall be applied toward the Purchase Price at Closing.',
            relevance: 'relevant',
          },
        ],
        resolved: false,
      },
      {
        id: 'f-payment-structure',
        label: 'Payment Structure',
        value: 'Cash at closing, wire transfer',
        issueLevel: null,
        sectionRef: '§2.4',
        aiReasoning: 'The payment structure was identified in Section 2.4 of the Agreement. The clause requires wire transfer of immediately available funds at Closing, with instructions provided no later than two Business Days prior to the Closing Date. This is a standard payment mechanism for transactions of this type and no contingent payment or earnout provisions were identified.',
        citations: [
          {
            id: 'cit-ps-1',
            documentId: 'doc-1',
            documentName: 'PSA_StateStreet_Federated_2024.pdf',
            page: 5,
            sectionRef: '§2.4',
            excerpt: 'At Closing, Buyer shall pay the Purchase Price by wire transfer of immediately available funds to the account designated by Seller in writing no later than two (2) Business Days prior to the Closing Date. The wire transfer instructions shall specify the account number, routing number, and financial institution of Seller\'s designated account.',
            relevance: 'relevant',
          },
        ],
        resolved: false,
      },
    ],
  },
  {
    id: 'indemnification',
    title: 'Indemnification',
    fields: [
      {
        id: 'f-indemnity-cap',
        label: 'Indemnity Cap',
        value: 'Limited to purchase price',
        issueLevel: 'warning',
        issueFlag: 'Indemnity cap equals purchase price only — no multiplier. Industry standard is 1.5–2× for transactions of this size.',
        sectionRef: '§6.2(a)',
        aiReasoning: 'The indemnity cap was extracted from Section 6.2(a). The clause establishes that the Seller\'s aggregate liability for indemnification "shall not exceed the Purchase Price of Forty-Two Million Five Hundred Thousand Dollars ($42,500,000)." A review of the remaining Article 6 provisions confirmed no secondary cap, carve-out, or separate liability basket applies to modify this ceiling.',
        citations: [
          {
            id: 'cit-ic-1',
            documentId: 'doc-1',
            documentName: 'PSA_StateStreet_Federated_2024.pdf',
            page: 18,
            sectionRef: '§6.2(a)',
            excerpt: 'The aggregate liability of the Seller Indemnifying Parties under this Article 6 for Losses shall not exceed the Purchase Price of Forty-Two Million Five Hundred Thousand Dollars ($42,500,000). The parties acknowledge that this limitation reflects the negotiated allocation of risk between the parties and shall apply regardless of the nature or basis of any indemnification claim.',
            relevance: 'relevant',
          },
        ],
        resolved: false,
      },
      {
        id: 'f-aggregate-threshold',
        label: 'Aggregate Threshold',
        value: '$425,000 (1% of purchase price)',
        issueLevel: 'warning',
        issueFlag: 'Basket threshold may be too high — could prevent recovery of smaller but significant claims.',
        sectionRef: '§6.2(a)',
        aiReasoning: 'The aggregate threshold (basket) was extracted from the opening paragraph of Section 6.2(a). The basket amount of $425,000 represents exactly 1% of the $42,500,000 Purchase Price. This is a "tipping basket" structure, meaning Seller becomes liable for all Losses exceeding the Basket Amount once the threshold is crossed, rather than only the excess above the basket.',
        citations: [
          {
            id: 'cit-at-1',
            documentId: 'doc-1',
            documentName: 'PSA_StateStreet_Federated_2024.pdf',
            page: 18,
            sectionRef: '§6.2(a)',
            excerpt: 'The Seller Indemnifying Parties shall not be required to make any indemnification payment unless and until the aggregate amount of all Losses for which indemnification is sought exceeds Four Hundred Twenty-Five Thousand Dollars ($425,000) (the "Basket Amount"), representing one percent (1%) of the Purchase Price, at which point Seller shall be liable for all such Losses in excess of the Basket Amount.',
            relevance: 'relevant',
          },
        ],
        resolved: false,
      },
      {
        id: 'f-consequential-damages',
        label: 'Consequential Damages',
        value: 'Waived by both parties',
        issueLevel: 'critical',
        issueFlag: 'Complete waiver of consequential damages removes ability to recover lost profits and business interruption losses.',
        sectionRef: '§6.5',
        aiReasoning: 'The consequential damages waiver was identified in Section 6.5. This is a mutual limitation applying to both Parties, written in all-caps as is customary for conspicuous disclaimers. The waiver is comprehensive and explicitly lists lost profits, loss of revenue, anticipated business, and business interruption as excluded damages. No carve-outs or exceptions to this limitation were found in the surrounding provisions.',
        citations: [
          {
            id: 'cit-cd-1',
            documentId: 'doc-1',
            documentName: 'PSA_StateStreet_Federated_2024.pdf',
            page: 20,
            sectionRef: '§6.5',
            excerpt: 'NOTWITHSTANDING ANYTHING IN THIS AGREEMENT TO THE CONTRARY, IN NO EVENT SHALL EITHER PARTY BE LIABLE TO THE OTHER PARTY FOR ANY CONSEQUENTIAL, INCIDENTAL, INDIRECT, SPECIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO THIS AGREEMENT, INCLUDING WITHOUT LIMITATION ANY LOST PROFITS, LOSS OF REVENUE, LOSS OF ANTICIPATED BUSINESS, OR BUSINESS INTERRUPTION, REGARDLESS OF WHETHER SUCH PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.',
            relevance: 'relevant',
          },
        ],
        resolved: false,
      },
    ],
  },
  {
    id: 'liability-remedies',
    title: 'Liability & Remedies',
    fields: [
      {
        id: 'f-exclusive-remedy',
        label: 'Exclusive Remedy',
        value: 'Indemnification is sole remedy post-closing',
        issueLevel: 'info',
        issueFlag: 'Exclusive remedy clause limits all post-closing recourse to the indemnification provisions.',
        sectionRef: '§6.6',
        aiReasoning: 'The exclusive remedy clause was extracted from Section 6.6. This provision limits post-Closing recourse for both Parties to the indemnification framework established in Article 6. The clause is broadly worded and encompasses all theories of liability. Reviewer verification confirmed this is consistent with the overall risk allocation negotiated between the Parties.',
        citations: [
          {
            id: 'cit-er-1',
            documentId: 'doc-1',
            documentName: 'PSA_StateStreet_Federated_2024.pdf',
            page: 21,
            sectionRef: '§6.6',
            excerpt: 'Following the Closing, the indemnification provisions set forth in this Article 6 shall constitute the sole and exclusive remedy of each party with respect to any and all claims arising out of or relating to this Agreement, the transactions contemplated herein, or the subject matter hereof, regardless of whether such claims are based in contract, tort, strict liability, or any other legal or equitable theory.',
            relevance: 'relevant',
          },
        ],
        resolved: true,
        resolvedBy: 'Sarah Chen',
        resolvedAt: 'Jan 20, 2024 at 2:15 PM',
      },
      {
        id: 'f-breach-cure',
        label: 'Breach Cure Window',
        value: '30 calendar days',
        issueLevel: 'warning',
        issueFlag: '30-day cure period is shorter than the 60-day standard. May not provide adequate time to remedy complex breaches.',
        sectionRef: '§7.2(a)',
        aiReasoning: 'The breach cure window was extracted from Section 7.2(a). The Agreement provides a 30-calendar-day cure period from the date the non-breaching Party delivers written notice specifying the breach. This is the only cure period referenced in the Agreement; no extended or alternative timelines were identified for specific types of breaches.',
        citations: [
          {
            id: 'cit-bc-1',
            documentId: 'doc-1',
            documentName: 'PSA_StateStreet_Federated_2024.pdf',
            page: 25,
            sectionRef: '§7.2(a)',
            excerpt: 'In the event of any material breach of this Agreement by either party, the non-breaching party shall provide written notice to the breaching party specifying the nature of such breach in reasonable detail. The breaching party shall have thirty (30) calendar days following receipt of such written notice to cure such breach to the reasonable satisfaction of the non-breaching party.',
            relevance: 'relevant',
          },
        ],
        resolved: false,
      },
      {
        id: 'f-jury-waiver',
        label: 'Jury Trial Waiver',
        value: 'Both parties waive right to jury trial',
        issueLevel: 'critical',
        issueFlag: 'Complete jury trial waiver. Ensure client is aware this limits litigation options to bench trial only.',
        sectionRef: '§7.16',
        aiReasoning: 'The jury trial waiver was extracted from Section 7.16. This is a mutual, irrevocable waiver applying to both Parties and covering all actions, proceedings, and counterclaims related to the Agreement. Written in all-caps to satisfy conspicuousness requirements in Delaware and New York. No carve-outs or exceptions were identified.',
        citations: [
          {
            id: 'cit-jw-1',
            documentId: 'doc-1',
            documentName: 'PSA_StateStreet_Federated_2024.pdf',
            page: 28,
            sectionRef: '§7.16',
            excerpt: 'EACH OF THE PARTIES TO THIS AGREEMENT HEREBY IRREVOCABLY AND UNCONDITIONALLY WAIVES, TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, ANY AND ALL RIGHTS TO A TRIAL BY JURY IN ANY ACTION, PROCEEDING, OR COUNTERCLAIM ARISING OUT OF OR RELATED TO THIS AGREEMENT OR THE TRANSACTIONS CONTEMPLATED HEREIN.',
            relevance: 'relevant',
          },
        ],
        resolved: false,
      },
    ],
  },
  {
    id: 'covenants',
    title: 'Covenants & Restrictions',
    fields: [
      {
        id: 'f-non-compete',
        label: 'Non-Compete',
        value: '36 months, continental United States',
        issueLevel: 'info',
        issueFlag: 'Non-compete references a separate Side Agreement dated January 2024 — verify that this agreement is included in the document package.',
        sectionRef: '§4.2(e)',
        aiReasoning: 'The non-compete obligation was extracted from Section 4.2(e). The restriction applies for 36 months post-Closing across the entire continental United States. The clause incorporates by reference a separate "Non-Compete Side Agreement dated January 2024," which contains additional terms and carve-outs. Reviewer confirmed the Side Agreement (Side_Agreement_NonCompete.pdf) has been uploaded to the document package.',
        citations: [
          {
            id: 'cit-nc-1',
            documentId: 'doc-1',
            documentName: 'PSA_StateStreet_Federated_2024.pdf',
            page: 12,
            sectionRef: '§4.2(e)',
            excerpt: 'For a period of thirty-six (36) months following the Closing Date, the Seller and each of the Seller\'s Affiliates shall not, directly or indirectly, own, manage, operate, join, control, or participate in the ownership, management, operation, or control of any business that competes with the Business anywhere within the continental United States. The parties acknowledge that additional terms and carve-outs applicable to this non-competition covenant are set forth in the Side Agreement dated January 2024 (the "Non-Compete Side Agreement"), which is incorporated herein by reference.',
            relevance: 'relevant',
          },
          {
            id: 'cit-nc-2',
            documentId: 'doc-3',
            documentName: 'Side_Agreement_NonCompete.pdf',
            page: 1,
            sectionRef: '§1',
            excerpt: 'This Non-Compete Side Agreement ("Side Agreement") is entered into as of January 2024 by and between State Street Global Advisors and Federated Services Corp. This Side Agreement supplements and is incorporated into the Purchase and Sale Agreement dated January 18, 2024 and sets forth additional terms, definitions, and carve-outs applicable to the non-competition covenant in Section 4.2(e) of the PSA.',
            relevance: 'relevant',
          },
        ],
        resolved: true,
        resolvedBy: 'Sarah Chen',
        resolvedAt: 'Jan 22, 2024 at 10:30 AM',
      },
      {
        id: 'f-venue',
        label: 'Litigation Venue',
        value: 'State courts of Delaware OR federal courts of New York',
        issueLevel: 'warning',
        issueFlag: 'Conflicting venue provisions — specifying both Delaware state and New York federal courts creates ambiguity in forum selection.',
        sectionRef: '§7.15',
        aiReasoning: 'The venue provision was extracted from Section 7.15. The clause specifies two alternative courts: (a) the courts of the State of Delaware, and (b) the U.S. District Court for the Southern District of New York. This creates an ambiguity because both are described as "exclusive" jurisdiction, yet either Party could argue for their preferred forum.',
        citations: [
          {
            id: 'cit-ve-1',
            documentId: 'doc-1',
            documentName: 'PSA_StateStreet_Federated_2024.pdf',
            page: 27,
            sectionRef: '§7.15',
            excerpt: 'Each party irrevocably and unconditionally submits to the exclusive jurisdiction of (a) the courts of the State of Delaware, or (b) the United States District Court for the Southern District of New York, for the purpose of any action, suit, or proceeding arising out of or relating to this Agreement or the transactions contemplated herein. Each party agrees that service of process may be made by mailing a copy of the relevant document to the address specified in Section 7.3.',
            relevance: 'relevant',
          },
        ],
        resolved: false,
      },
    ],
  },
]

// ─── Documents ───────────────────────────────────────────────────────────────

export const TASK_DOCUMENTS: TaskDocument[] = [
  {
    id: 'doc-1',
    name: 'PSA_StateStreet_Federated_2024.pdf',
    type: 'Main',
    size: '2.4 MB',
    uploaded: 'Jan 18, 2024',
  },
  {
    id: 'doc-2',
    name: 'Disclosure_Schedules_Exhibit_A.pdf',
    type: 'Supporting',
    size: '890 KB',
    uploaded: 'Jan 18, 2024',
  },
  {
    id: 'doc-3',
    name: 'Side_Agreement_NonCompete.pdf',
    type: 'Supporting',
    size: '156 KB',
    uploaded: 'Jan 19, 2024',
  },
]

// ─── Audit trail ─────────────────────────────────────────────────────────────

export const INITIAL_AUDIT: AuditEntry[] = [
  {
    id: 'audit-1',
    type: 'system',
    actor: 'System',
    action: 'Extraction started',
    timestamp: 'Jan 18, 2024 at 3:00 PM',
  },
  {
    id: 'audit-2',
    type: 'system',
    actor: 'System',
    action: 'Extraction completed — 12 clauses extracted, 6 issues found',
    timestamp: 'Jan 18, 2024 at 3:04 PM',
  },
  {
    id: 'audit-3',
    type: 'system',
    actor: 'System',
    action: 'Task assigned to Sarah Chen',
    timestamp: 'Jan 18, 2024 at 3:04 PM',
  },
  {
    id: 'audit-4',
    type: 'human-verify',
    actor: 'Sarah Chen',
    action: 'Verified: Exclusive remedy limits recourse to indemnification',
    detail: 'Confirmed with client — acceptable under the negotiated risk allocation.',
    timestamp: 'Jan 20, 2024 at 2:15 PM',
  },
  {
    id: 'audit-5',
    type: 'human-verify',
    actor: 'Sarah Chen',
    action: 'Verified: Non-compete tied to external Side Agreement',
    detail: 'Side_Agreement_NonCompete.pdf confirmed uploaded and cross-referenced.',
    timestamp: 'Jan 22, 2024 at 10:30 AM',
  },
]
