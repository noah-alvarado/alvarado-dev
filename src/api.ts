
/**
 * Submit a message from the contact form to Noah.
 *
 * @export
 * @param {FormData} data
 * @return {*}  {Promise<Response>}
 */
export function contactNoah(data: FormData): Promise<Response> {
  return new Promise((resolve, reject) => setTimeout(() => resolve({ ok: true } as any), 400));
}
