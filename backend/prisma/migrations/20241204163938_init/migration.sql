-- CreateTable
CREATE TABLE "MessagesReadStatus" (
    "id" SERIAL NOT NULL,
    "messageId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conversationId" INTEGER,

    CONSTRAINT "MessagesReadStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MessagesReadStatus" ADD CONSTRAINT "MessagesReadStatus_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessagesReadStatus" ADD CONSTRAINT "MessagesReadStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessagesReadStatus" ADD CONSTRAINT "MessagesReadStatus_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
