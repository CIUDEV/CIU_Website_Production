-- Store the Azure Blob URL for an outreach marketing poster.
-- sqlcmd defaults QUOTED_IDENTIFIER OFF; run with -I.
--
-- sqlcmd \
--   -S ciu-sql-prod.database.windows.net \
--   -d ciu-db-prod \
--   -G \
--   -I \
--   -P /tmp/sqltoken \
--   -Q "IF COL_LENGTH('dbo.outreach_campaigns', 'image') IS NULL ALTER TABLE dbo.outreach_campaigns ADD image NVARCHAR(1000) NULL;"

SET QUOTED_IDENTIFIER ON;
SET ANSI_NULLS ON;
GO

IF COL_LENGTH('dbo.outreach_campaigns', 'image') IS NULL
BEGIN
    ALTER TABLE dbo.outreach_campaigns ADD image NVARCHAR(1000) NULL;
END
GO
