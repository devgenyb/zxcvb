export const CONVERTER_API_KEY = "6f491fae396d9fbcf5fef19f";

interface IResponseEntity {
	result: "success" | "error";
}

interface ICodes extends IResponseEntity{
    supported_codes: [string, string][]
}

interface IPair extends IResponseEntity{
	"base_code": string,
	"target_code": string,
	"conversion_rate": number
}

class ApiConverter {
	private api_key: string;
    public codes: [string, string][];

	constructor(api_key: string) {
		this.api_key = api_key;
	}

	public async getCurrenciesNames(): Promise<ICodes> {
		return await this.fetchApi<ICodes>("codes");
	}

	public async getPairConversion(base_code: string, target_code: string) {
		return await this.fetchApi<IPair>(`pair/${base_code}/${target_code}`);
	}

	private async fetchApi<T extends IResponseEntity>(endpoind: string) {
		try {
			const response: Response = await fetch(
				` https://v6.exchangerate-api.com/v6/${this.api_key}/${endpoind}`
			);
			const data: T = await response.json();
            if (data.result === 'error') throw new Error()
			return data;
		} catch (error) {
            alert("proplem with request");
        }
	}
}

export default new ApiConverter(CONVERTER_API_KEY)