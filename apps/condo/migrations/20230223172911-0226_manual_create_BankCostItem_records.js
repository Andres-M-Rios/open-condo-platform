exports.up = async (knex) => {
    await knex.raw(`
        BEGIN;
        --create BankCategory
        INSERT INTO "BankCategory" (dv, sender, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', 'maintenance_and_current_repair_of_common_property_in_an_apartment_building', '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 1, '2023-02-22 00:00:00.000000', '2023-02-22 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCategory" (dv, sender, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', 'apartment_building_management', '5378d426-d9e9-405b-86f1-b82b6e2df7cc', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCategory" (dv, sender, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', 'overhaul', '8193244c-1fc1-47f9-a8dd-1ebf6ca1b316', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCategory" (dv, sender, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', 'drainage', '1cf00b00-e8c1-4062-8b6d-c9394665af69', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCategory" (dv, sender, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', 'water_supply', 'b37b0cd9-f90b-48f8-b257-5deb1aa0d788', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCategory" (dv, sender, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', 'garbage_collection_and_disposal', 'a34659c3-2ed3-442a-a415-f54db123f7af', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCategory" (dv, sender, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', 'gas', '8db4145f-2d88-4444-aff0-5b8e020fd7df', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCategory" (dv, sender, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', 'hot_water_supply', '36b0443f-42ce-4f21-99c4-1d0b9cab699c', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCategory" (dv, sender, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', 'additional_services', 'e24d4c7e-cf55-4973-8295-2fe7b193ec2e', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCategory" (dv, sender, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', 'thermal_energy', 'f37866e3-5656-40ab-9a46-f98407589606', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCategory" (dv, sender, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', 'cold_water_supply', 'b81b6669-1293-458c-848f-88496cbf1128', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCategory" (dv, sender, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', 'electric_energy', 'd2915479-a776-4bff-9645-265454a38461', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        --create BankCostItem
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'emergency_service', '8b589a43-4f0e-446f-b519-775f3d28dc1e', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '5378d426-d9e9-405b-86f1-b82b6e2df7cc', 'rent', 'f0e247a7-a96b-4340-9ae6-a72d2ca78f48', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '5378d426-d9e9-405b-86f1-b82b6e2df7cc', 'banking_services', 'b773bea9-3f47-49b3-a5b1-74c0c9070504', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'maintenance_and_operation', '6004e8f8-51c1-4173-9024-902f83e9ee1d', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '8193244c-1fc1-47f9-a8dd-1ebf6ca1b316', 'overhaul', '0ce10c86-44bd-4cd5-9879-7d1a17d4d0d2', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, 'b37b0cd9-f90b-48f8-b257-5deb1aa0d788', 'water_supply', '0fdc54f0-f834-497d-abe5-1323acbfc91b', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '5378d426-d9e9-405b-86f1-b82b6e2df7cc', 'compensation_for_damage', '06a7da84-1831-4851-9b60-14a5862af4a6', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, 'a34659c3-2ed3-442a-a415-f54db123f7af', 'garbage_collection_and_disposal', 'ffa60f5f-d4d9-4873-9d46-2e4d9626928e', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '8db4145f-2d88-4444-aff0-5b8e020fd7df', 'gas', '55e9aa2f-d8e0-4e63-b3bd-f4607c9eef71', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'deratization_and_disinfestation', 'e902c57f-69a7-482b-bac3-4cf7acaca96b', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'materials_for_repair_and_maintenance', '3ff7a8e7-5600-42a0-8ee7-a85fe14ca4d9', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'purchase_of_machinery_and_equipment', 'a7ddc9ed-ced6-4a1d-888d-22fc0641cbd9', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '5378d426-d9e9-405b-86f1-b82b6e2df7cc', 'employee_wages', '091870b1-81d4-4d3e-b108-b7db29bb3399', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '5378d426-d9e9-405b-86f1-b82b6e2df7cc', 'rental_fee', 'b2d4d9c9-f564-4f77-a715-19f3fc24db22', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, 'e24d4c7e-cf55-4973-8295-2fe7b193ec2e', 'concierges', '6638a702-e2ce-4bb9-b2f6-b493737b74af', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'materials_for_maintenance_and_current_repair', '68dc6c2d-1900-48bd-b6bc-dd8ebb0fee7a', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '5378d426-d9e9-405b-86f1-b82b6e2df7cc', 'taxes', '58df8141-1428-401e-a835-79f89e022e13', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'equipment', '4b7533c9-5ec2-4c04-8f23-deeee0f1be83', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'maintenance_of_access_control_systems', 'd4d32821-351f-4081-9279-cc4f66ddc844', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'intercom_service', '5198062d-4a1e-4b44-b42a-a82e00d19400', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'maintenance_and_inspection_of_metering_devices', 'e5b7d198-ebfe-4d7c-8934-0057e61fb803', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'maintenance_of_elevator_equipment', '7ea2ec6b-9a4c-4f2c-889a-56a70a094551', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'maintenance_of_fireplaces_and_hearths', '84c927c9-e1c7-494e-82d4-19536495c4aa', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'maintenance_of_ventilation_systems', '8241c890-4ef8-44b7-b08c-fce2b1fba48b', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'maintenance_of_video_surveillance_systems', '2b6a0f4d-890c-4ed7-95c8-de6c7f96ff8d', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'domestic_gas_equipment', 'f5ed327d-b41c-4b77-b6a1-b42f4a610720', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'maintenance_of_water_supply_systems_cold_and_hot_heating_and_sanitation', 'e277c0ad-c15c-4904-9b60-2cffebd9e7ef', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, 'e24d4c7e-cf55-4973-8295-2fe7b193ec2e', 'security', '8a10bc4f-ff0d-4871-acbe-c6faf24ddc27', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '5378d426-d9e9-405b-86f1-b82b6e2df7cc', 'services_for_interaction_with_owners_and_citizens', '83ab223d-801d-421c-8f03-6b464ef15cff', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'other_maintenance', '196344de-a7f3-4b47-83ad-f8ac8f802214', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '5378d426-d9e9-405b-86f1-b82b6e2df7cc', 'other_management_services', '101cf8e3-550b-49e4-89a7-dc205a56488e', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'radio_point', '386601cd-3361-4185-8c91-347a4cbc13ca', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'current_repair_of_structural_elements_of_an_apartment_building', '90ddd1f8-04ca-42cf-8475-80eac81e0b7e', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, 'e24d4c7e-cf55-4973-8295-2fe7b193ec2e', 'tv', 'f1c72dae-4023-4217-b47f-0dc5dab56fb5', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, 'f37866e3-5656-40ab-9a46-f98407589606', 'thermal_energy', 'c9a6794f-d0cf-4da9-aa4d-11ec7fb36e8b', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'transport', 'd78369a9-a976-4f06-b193-18da1f531100', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'cleaning', 'df635888-f7f6-4c5f-a3a1-e7b465ee1a5e', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c', 'house_area_cleaning', '2c32810c-ef56-4e6b-8420-cb9aa2b49ac4', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '5378d426-d9e9-405b-86f1-b82b6e2df7cc', 'residential_and_utility_billing_services', 'c67f1ea7-d62c-49ea-9534-f877f82e293a', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '5378d426-d9e9-405b-86f1-b82b6e2df7cc', 'finance_and_accounting', '1630f2bc-5689-4ab4-94b0-a84e02911a2c', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, 'e24d4c7e-cf55-4973-8295-2fe7b193ec2e', 'targeted_fees', '8e858d07-25b8-4dbd-8440-99896198d0ad', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '5378d426-d9e9-405b-86f1-b82b6e2df7cc', 'fines_of_state_regulatory_bodies', '3fc844e5-ace5-4f30-bac2-fda671c113d4', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, 'd2915479-a776-4bff-9645-265454a38461', 'electric_energy', 'b9463e7e-1b81-49ed-a23d-993a55e88060', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '5378d426-d9e9-405b-86f1-b82b6e2df7cc', 'legal_services', 'd109694a-71fa-496a-9e70-b84fd496e3a8', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '5378d426-d9e9-405b-86f1-b82b6e2df7cc', 'debt_collection', '5cac3eee-0055-41ae-8f85-06e54a5ef587', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);
        INSERT INTO "BankCostItem" (dv, sender, "isOutcome", category, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy") VALUES (1, '{"dv": 1, "fingerprint": "initial"}', true, '1cf00b00-e8c1-4062-8b6d-c9394665af69', 'drainage', '0bfda74c-f1a5-4fc0-8ab9-803569dcc68a', 1, '2023-02-23 00:00:00.000000', '2023-02-23 00:00:00.000000', null, null, null, null);

        COMMIT;
    `)
}

exports.down = async (knex) => {
    await knex.raw(`
        BEGIN;
        
DELETE FROM "BankCostItem" WHERE id = '8b589a43-4f0e-446f-b519-775f3d28dc1e';
DELETE FROM "BankCostItem" WHERE id = 'f0e247a7-a96b-4340-9ae6-a72d2ca78f48';
DELETE FROM "BankCostItem" WHERE id = 'b773bea9-3f47-49b3-a5b1-74c0c9070504';
DELETE FROM "BankCostItem" WHERE id = '6004e8f8-51c1-4173-9024-902f83e9ee1d';
DELETE FROM "BankCostItem" WHERE id = '0ce10c86-44bd-4cd5-9879-7d1a17d4d0d2';
DELETE FROM "BankCostItem" WHERE id = '0fdc54f0-f834-497d-abe5-1323acbfc91b';
DELETE FROM "BankCostItem" WHERE id = '06a7da84-1831-4851-9b60-14a5862af4a6';
DELETE FROM "BankCostItem" WHERE id = 'ffa60f5f-d4d9-4873-9d46-2e4d9626928e';
DELETE FROM "BankCostItem" WHERE id = '55e9aa2f-d8e0-4e63-b3bd-f4607c9eef71';
DELETE FROM "BankCostItem" WHERE id = 'e902c57f-69a7-482b-bac3-4cf7acaca96b';
DELETE FROM "BankCostItem" WHERE id = '3ff7a8e7-5600-42a0-8ee7-a85fe14ca4d9';
DELETE FROM "BankCostItem" WHERE id = 'a7ddc9ed-ced6-4a1d-888d-22fc0641cbd9';
DELETE FROM "BankCostItem" WHERE id = '091870b1-81d4-4d3e-b108-b7db29bb3399';
DELETE FROM "BankCostItem" WHERE id = 'b2d4d9c9-f564-4f77-a715-19f3fc24db22';
DELETE FROM "BankCostItem" WHERE id = '6638a702-e2ce-4bb9-b2f6-b493737b74af';
DELETE FROM "BankCostItem" WHERE id = '68dc6c2d-1900-48bd-b6bc-dd8ebb0fee7a';
DELETE FROM "BankCostItem" WHERE id = '58df8141-1428-401e-a835-79f89e022e13';
DELETE FROM "BankCostItem" WHERE id = '4b7533c9-5ec2-4c04-8f23-deeee0f1be83';
DELETE FROM "BankCostItem" WHERE id = 'd4d32821-351f-4081-9279-cc4f66ddc844';
DELETE FROM "BankCostItem" WHERE id = '5198062d-4a1e-4b44-b42a-a82e00d19400';
DELETE FROM "BankCostItem" WHERE id = 'e5b7d198-ebfe-4d7c-8934-0057e61fb803';
DELETE FROM "BankCostItem" WHERE id = '7ea2ec6b-9a4c-4f2c-889a-56a70a094551';
DELETE FROM "BankCostItem" WHERE id = '84c927c9-e1c7-494e-82d4-19536495c4aa';
DELETE FROM "BankCostItem" WHERE id = '8241c890-4ef8-44b7-b08c-fce2b1fba48b';
DELETE FROM "BankCostItem" WHERE id = '2b6a0f4d-890c-4ed7-95c8-de6c7f96ff8d';
DELETE FROM "BankCostItem" WHERE id = 'f5ed327d-b41c-4b77-b6a1-b42f4a610720';
DELETE FROM "BankCostItem" WHERE id = 'e277c0ad-c15c-4904-9b60-2cffebd9e7ef';
DELETE FROM "BankCostItem" WHERE id = '8a10bc4f-ff0d-4871-acbe-c6faf24ddc27';
DELETE FROM "BankCostItem" WHERE id = '83ab223d-801d-421c-8f03-6b464ef15cff';
DELETE FROM "BankCostItem" WHERE id = '196344de-a7f3-4b47-83ad-f8ac8f802214';
DELETE FROM "BankCostItem" WHERE id = '101cf8e3-550b-49e4-89a7-dc205a56488e';
DELETE FROM "BankCostItem" WHERE id = '386601cd-3361-4185-8c91-347a4cbc13ca';
DELETE FROM "BankCostItem" WHERE id = '90ddd1f8-04ca-42cf-8475-80eac81e0b7e';
DELETE FROM "BankCostItem" WHERE id = 'f1c72dae-4023-4217-b47f-0dc5dab56fb5';
DELETE FROM "BankCostItem" WHERE id = 'c9a6794f-d0cf-4da9-aa4d-11ec7fb36e8b';
DELETE FROM "BankCostItem" WHERE id = 'd78369a9-a976-4f06-b193-18da1f531100';
DELETE FROM "BankCostItem" WHERE id = 'df635888-f7f6-4c5f-a3a1-e7b465ee1a5e';
DELETE FROM "BankCostItem" WHERE id = '2c32810c-ef56-4e6b-8420-cb9aa2b49ac4';
DELETE FROM "BankCostItem" WHERE id = 'c67f1ea7-d62c-49ea-9534-f877f82e293a';
DELETE FROM "BankCostItem" WHERE id = '1630f2bc-5689-4ab4-94b0-a84e02911a2c';
DELETE FROM "BankCostItem" WHERE id = '8e858d07-25b8-4dbd-8440-99896198d0ad';
DELETE FROM "BankCostItem" WHERE id = '3fc844e5-ace5-4f30-bac2-fda671c113d4';
DELETE FROM "BankCostItem" WHERE id = 'b9463e7e-1b81-49ed-a23d-993a55e88060';
DELETE FROM "BankCostItem" WHERE id = 'd109694a-71fa-496a-9e70-b84fd496e3a8';
DELETE FROM "BankCostItem" WHERE id = '5cac3eee-0055-41ae-8f85-06e54a5ef587';
DELETE FROM "BankCostItem" WHERE id = '0bfda74c-f1a5-4fc0-8ab9-803569dcc68a';

DELETE FROM "BankCategory" WHERE id = '0375f9bb-2084-4fd7-aa7e-ef1a19ebbf7c';
DELETE FROM "BankCategory" WHERE id = '5378d426-d9e9-405b-86f1-b82b6e2df7cc';
DELETE FROM "BankCategory" WHERE id = '8193244c-1fc1-47f9-a8dd-1ebf6ca1b316';
DELETE FROM "BankCategory" WHERE id = '1cf00b00-e8c1-4062-8b6d-c9394665af69';
DELETE FROM "BankCategory" WHERE id = 'b37b0cd9-f90b-48f8-b257-5deb1aa0d788';
DELETE FROM "BankCategory" WHERE id = 'a34659c3-2ed3-442a-a415-f54db123f7af';
DELETE FROM "BankCategory" WHERE id = '8db4145f-2d88-4444-aff0-5b8e020fd7df';
DELETE FROM "BankCategory" WHERE id = '36b0443f-42ce-4f21-99c4-1d0b9cab699c';
DELETE FROM "BankCategory" WHERE id = 'e24d4c7e-cf55-4973-8295-2fe7b193ec2e';
DELETE FROM "BankCategory" WHERE id = 'f37866e3-5656-40ab-9a46-f98407589606';
DELETE FROM "BankCategory" WHERE id = 'b81b6669-1293-458c-848f-88496cbf1128';
DELETE FROM "BankCategory" WHERE id = 'd2915479-a776-4bff-9645-265454a38461';
            
        COMMIT;
    `)
}
