import dotenv from 'dotenv';

dotenv.config();

const hubspotBearerToken = process.env.HUBSPOT_BEARER_TOKEN;

const HubspotPostContactsUrl = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert';
const HubspotPostCompaniesUrl = 'https://api.hubapi.com/crm/v3/objects/companies/batch/upsert';
const HubspotCreateAssociationUrl =
  'https://api.hubapi.com/crm/v3/associations/contact/company/batch/create';
const HubspotDeleteContactsUrl = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/archive';
const HubspotDeleteCompaniesUrl = 'https://api.hubapi.com/crm/v3/objects/companies/batch/archive';
const HubspotGetContactsUrl = 'https://api.hubapi.com/crm/v3/objects/contacts';
const HubspotGetCompaniesUrl = 'https://api.hubapi.com/crm/v3/objects/companies';

const postHubspotContacts = async (contacts) => {
  const bodyData = {
    inputs: [...contacts],
  };

  console.log('Posting the following contacts to HubSpot:');
  console.log(JSON.stringify(bodyData, null, 2));
  console.log('------------------------------------------');

  try {
    const response = await fetch(HubspotPostContactsUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${hubspotBearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      console.error('------------------------------------------');
      console.error('Failed to post HubSpot contacts.');
      console.error(`HTTP error! Status: ${response.status.toString()}`);
      console.error('------------------------------------------');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Failed to post HubSpot contacts.');
    console.error(error.toString());
    return error.toString();
  }
};

const postHubspotCompanies = async (companies) => {
  const bodyData = {
    inputs: [...companies],
  };

  console.log('Posting the following company to HubSpot: ');
  console.log(JSON.stringify(bodyData, null, 2));
  console.log('------------------------------------------');

  try {
    const response = await fetch(HubspotPostCompaniesUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${hubspotBearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      console.error('------------------------------------------');
      console.error('Failed to post HubSpot companies.');
      console.error(`HTTP error! Status: ${response.status.toString()}`);
      console.error('------------------------------------------');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Failed to post HubSpot companies.');
    console.error(error.toString());
    return error.toString();
  }
};

// usage: const associationResult = await createHubspotAssociation(associations);
const createHubspotAssociation = async (associations) => {
  const bodyData = {
    input: [...associations],
  };

  const response = await fetch(HubspotCreateAssociationUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${hubspotBearerToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create association: ${response.status}`);
  }
  return await response.json();
};

export const getHubspotContacts = async () => {
  console.log('Getting all HubSpot contacts...');
  const allContacts = [];
  let after = null;

  try {
    do {
      const url = new URL(HubspotGetContactsUrl);
      if (after) {
        url.searchParams.append('after', after);
      }
      url.searchParams.append('properties', 'netflex_contact_id,company,email,firstname,lastname');

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${hubspotBearerToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.log('------------------------------------------');
        console.log('Failed to get HubSpot contacts.');
        console.log(`HTTP error! Status: ${response.status.toString()}`);
        console.log('------------------------------------------');
        return;
      }

      const data = await response.json();
      const contacts = await data.results;
      allContacts.push([...contacts]);

      after = data.paging?.next?.after || null;
    } while (after);

    console.log('All contacts were successfully fetched from HubSpot!');
    console.log(JSON.stringify(allContacts, null, 2));
    return allContacts;
  } catch (error) {
    console.log('Failed to get HubSpot contacts.');
    console.log(error);
  }
};

export const getHubspotCompanies = async () => {
  console.log('Getting all HubSpot companies...');
  const allCompanies = [];
  let after = null;

  try {
    do {
      const url = new URL(HubspotGetCompaniesUrl);
      if (after) {
        url.searchParams.append('after', after);
      }
      url.searchParams.append(
        'properties',
        'domain,name,phone,city,country,industry,hubspot_owner_id,visma_company_id'
      );

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${hubspotBearerToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.log('------------------------------------------');
        console.log('Failed to get HubSpot companies.');
        console.log(`HTTP error! Status: ${response.status.toString()}`);
        console.log('------------------------------------------');
        return;
      }

      const data = await response.json();
      const contacts = await data.results;
      allCompanies.push([...contacts]);

      after = data.paging?.next?.after || null;
    } while (after);

    console.log('All companies were successfully fetched from HubSpot!');
    console.log(JSON.stringify(allCompanies, null, 2));
    return allCompanies;
  } catch (error) {
    console.log('Failed to get HubSpot companies.');
    console.log(error);
  }
};

// contactIds: { id: string }[]
const deleteHubspotContacts = async (contactIds) => {
  const bodyData = {
    inputs: [...contactIds],
  };

  console.log('Deleting the following contacts from HubSpot:');
  console.log(bodyData);
  console.log('------------------------------------------');

  try {
    const response = await fetch(HubspotDeleteContactsUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${hubspotBearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      console.log('------------------------------------------');
      console.log('Failed to delete HubSpot contacts.');
      console.log(`HTTP error! Status: ${response.status.toString()}`);
      console.log('------------------------------------------');
      return;
    }

    const responseData = response.status === 204 ? {} : await response.json();
    console.log(responseData);
  } catch (error) {
    console.log('Failed to delete HubSpot contacts.');
    console.log(error.toString());
  }
};

// companyIds: { id: string }[]
const deleteHubspotCompanies = async (companyIds) => {
  const bodyData = {
    inputs: [...companyIds],
  };

  console.log('Deleting the following companies from HubSpot:');
  console.log(bodyData);
  console.log('------------------------------------------');

  try {
    const response = await fetch(HubspotDeleteCompaniesUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${hubspotBearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      console.log('------------------------------------------');
      console.log('Failed to delete HubSpot companies.');
      console.log(`HTTP error! Status: ${response.status.toString()}`);
      console.log('------------------------------------------');
      return;
    }

    const responseData = response.status === 204 ? {} : await response.json();
    console.log(responseData);
  } catch (error) {
    console.log('Failed to delete HubSpot companies.');
    console.log(error.toString());
  }
};

const deleteContacts = async () => {
  const contacts = await getHubspotContacts();

  for (const batch of contacts) {
    const contactIds = batch.map((contact) => ({
      id: contact.id,
    }));
    await deleteHubspotContacts(contactIds);
  }

  console.log('All contacts deleted successfully.');
};

const deleteCompanies = async () => {
  const companies = await getHubspotCompanies();

  for (const batch of companies) {
    const companyIds = batch.map((contact) => ({
      id: contact.id,
    }));
    await deleteHubspotCompanies(companyIds);
  }

  console.log('All companies deleted successfully.');
};


// await deleteContacts();
// await deleteCompanies();
