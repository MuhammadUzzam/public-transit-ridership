# Data contracts

Planned sources: CTA bus daily route boardings and CTA rail daily station entries. They are different units of observation and will be modeled separately.

Proposed common fields: `mode`, `entity_id`, `date`, `rides`; optional entity display name. Raw schema and actual quality must be verified in M02–M04. API contracts will be defined when the corresponding modules are approved.
