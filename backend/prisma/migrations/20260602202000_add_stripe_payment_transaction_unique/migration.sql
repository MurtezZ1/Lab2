-- Add a unique index so Stripe Payment Intent IDs can be used for safe lookup/upsert.
-- PostgreSQL allows multiple NULL values in a unique index, so existing manual pending
-- payments without a transaction_id remain valid.
CREATE UNIQUE INDEX "payments_transaction_id_key" ON "payments"("transaction_id");
