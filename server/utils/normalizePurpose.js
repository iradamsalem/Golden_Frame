export const normalizePurpose = (rawPurpose) => {
    const cleaned = rawPurpose?.toLowerCase().trim();
  
    switch (cleaned) {
      case 'linkedin':
        return 'linkedin';
      case 'instagram':
        return 'instagram';
      case 'facebook':
        return 'facebook';
      case 'twitter':
      case 'twitter/x':
        return 'twitter';
      case 'resume':
        return 'resume';
      case 'professional':
      case 'proffesional': // typo fallback
        return 'professional';
      case 'dating apps':
      case 'dating':
        return 'datingApps';
      default:
        return cleaned?.replace(/\s+/g, '') || 'unknown';
    }
  };
  