const formatColumn = (col) => {
    // remove prefixes
    let cleaned = col.replace(/^(MYCLOUD_|LINEITEM_)/i, "");
    // split on underscores, title-case each word
    return cleaned
      .split(/_/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  };

  export default formatColumn;