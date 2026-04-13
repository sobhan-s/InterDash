export const HiddenInputs = ({ user }: any) => (
  <>
    <input type="hidden" name="user_token" value={user?.token || ''} />
    <input type="hidden" name="user_data" value={JSON.stringify(user || {})} />
  </>
);