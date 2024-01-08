export type GmailMessageV1SummaryV1 = {
  id: string,
  threadId: string
};
export type GmailInboxState = {
  nextPageToken: string,
  resultSizeEstimate: number,
  messages: GmailMessageV1SummaryV1[]
};

export type GmailMessageV1 = {
  id: string,
  threadId: string,
  labelIds: string[],
  snippet: string,
  historyId: string,
  internalDate: string,
  payload: GmailMessagePartV1,
  sizeEstimate: number,
  raw: string
};

export type GmailMessagePartV1 = {
  partId: string,
  mimeType: string,
  filename: string,
  headers: GmailHeaderV1[],
  body: GmailMessagePartBodyV1,
  parts: GmailMessagePartV1[],
};

export type GmailMessagePartBodyV1 = {
  attachmentId: string,
  size: number,
  data: string
};

export type GmailHeaderV1 = {
  name: string,
  value: string
};

export type GmailThreadV1 = {
  historyId: string,
  id: string,
  snippet: string,
  messages: GmailMessageV1[]
};

export type GmailThreadsV1 = {
  threads: GmailThreadV1[],
  nextPageToken: string,
  resultSizeEstimate: number
};

