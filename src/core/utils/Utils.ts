export default class Utils {
	public static getVersion() {
		var json = require('../../../config/package-solution.json');
		return json["solution"]["version"];
	}

	public static removeUndefined(item) {

		return Object.keys(item).reduce((obj, key) => item[key] === undefined ? obj : { ...obj, [key]: item[key] }, {});

	}

	public static validateAndSanitizeUrl(url: string): string {
		if (!url || typeof url !== 'string') {
			return '';
		}

		const sanitized = url.replace(/javascript:/gi, '')
			.replace(/data:/gi, '')
			.replace(/vbscript:/gi, '')
			.replace(/on\w+=/gi, '')
			.replace(/<script[^>]*>.*?<\/script>/gi, '')
			.replace(/<[^>]*>/g, '');

		if (sanitized.indexOf('/') === 0 || sanitized.indexOf('SitePages/') !== -1 || sanitized.indexOf('_layouts/') !== -1) {
			return sanitized;
		}

		try {
			const urlObj = new URL(sanitized);
			const trustedDomains = [
				'sharepoint.com',
				'office.com',
				'microsoft.com',
				'powerbi.com'
			].filter(domain => domain !== '');

			const isValidDomain = trustedDomains.some(domain =>
				urlObj.hostname === domain || (urlObj.hostname.length > domain.length && urlObj.hostname.substr(urlObj.hostname.length - domain.length - 1) === '.' + domain)
			);

			if (isValidDomain && (urlObj.protocol === 'https:' || urlObj.protocol === 'http:')) {
				return sanitized;
			}
		} catch (e) {
			if (sanitized.indexOf('://') === -1 && sanitized.indexOf('//') !== 0) {
				return sanitized;
			}
		}

		console.warn('URL validation failed for:', url);
		return '';
	}

	public static openInSelfTab(url: string) {
		const validatedUrl = Utils.validateAndSanitizeUrl(url);
		if (validatedUrl) {
			window.location.assign(validatedUrl);
		}
	}

	public static openInNewTab(url: string) {
		const validatedUrl = Utils.validateAndSanitizeUrl(url);
		if (validatedUrl) {
			window.open(validatedUrl, '_blank');
		}
	}
}
