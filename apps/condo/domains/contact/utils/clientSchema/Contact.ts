/**
 * Generated by `createschema contact.Contact 'property:Relationship:Property:SET_NULL; name:Text; phone:Text; unitName?:Text; email?:Text;'`
 */

import {
    Contact,
    ContactCreateInput,
    ContactUpdateInput,
    QueryAllContactsArgs,
} from '@app/condo/schema'
import { generateReactHooks } from '@condo/domains/common/utils/codegeneration/generate.hooks'
import { Contact as ContactGQL } from '@condo/domains/contact/gql'

const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
} = generateReactHooks<Contact, ContactCreateInput, ContactUpdateInput, QueryAllContactsArgs>(ContactGQL)

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useSoftDelete,
}
