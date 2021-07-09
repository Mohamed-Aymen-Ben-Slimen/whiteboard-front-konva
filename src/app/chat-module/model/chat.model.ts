interface Chat{
  msg: string;
  from: string;
}

export default interface ChatModel extends Chat{
  data: [Chat];
  members: [string];
  status: string;
}

