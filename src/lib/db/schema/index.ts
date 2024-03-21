import { tagGroupSchema, tenantSchema } from './tenant_schema';
import { userSchema } from './user_schema';

export const schema = {
	tagGroup: tagGroupSchema,
	tenant: tenantSchema,
	user: userSchema
};
