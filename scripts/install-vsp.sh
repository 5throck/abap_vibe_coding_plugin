#!/bin/bash
# install-vsp.sh
# Downloads and installs the vsp binary from GitHub Releases.
# Usage: bash $CLAUDE_PLUGIN_ROOT/scripts/install-vsp.sh [version]
#
# Set VSP_REPO environment variable to override the default repository.

set -e

REPO="${VSP_REPO:-5throck/vsp}"
INSTALL_DIR="${CLAUDE_PLUGIN_ROOT:-$(dirname "$(dirname "$0")")}"
TARGET="$INSTALL_DIR/vsp"

# Determine platform
PLATFORM=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

# Normalize arch names
case "$ARCH" in
  x86_64)  ARCH="amd64" ;;
  aarch64) ARCH="arm64" ;;
  arm64)   ARCH="arm64" ;;
esac

# Normalize platform names
case "$PLATFORM" in
  darwin)  PLATFORM="darwin" ;;
  linux)   PLATFORM="linux" ;;
  msys*|cygwin*|mingw*) PLATFORM="windows" ;;
esac

echo "--- vsp Installer ---"
echo "Platform: $PLATFORM / $ARCH"
echo "Repository: $REPO"
echo "Install dir: $INSTALL_DIR"

# Get version: use argument or fetch latest
VERSION="${1:-}"
if [ -z "$VERSION" ]; then
  echo "Fetching latest release version..."
  VERSION=$(curl -s "https://api.github.com/repos/$REPO/releases/latest" \
    | grep '"tag_name"' \
    | head -1 \
    | cut -d'"' -f4)
  if [ -z "$VERSION" ]; then
    echo "Error: Could not determine latest version. Check that $REPO has releases."
    echo ""
    echo "Alternative: Build from source:"
    echo "  go install github.com/$REPO/cmd/vsp@latest"
    echo "  Then copy the binary to: $TARGET"
    exit 1
  fi
fi

echo "Version: $VERSION"

# Construct binary name
if [ "$PLATFORM" = "windows" ]; then
  BINARY_NAME="vsp-$PLATFORM-$ARCH.exe"
  TARGET="$TARGET.exe"
else
  BINARY_NAME="vsp-$PLATFORM-$ARCH"
fi

DOWNLOAD_URL="https://github.com/$REPO/releases/download/$VERSION/$BINARY_NAME"

echo "Downloading: $DOWNLOAD_URL"
curl -fL "$DOWNLOAD_URL" -o "$TARGET"
chmod +x "$TARGET"

echo ""
echo "✅ vsp $VERSION installed at: $TARGET"
echo ""
echo "Next steps:"
echo "  1. Set your SAP connection: export SAP_URL=https://your-sap-host:8080"
echo "  2. Set credentials: export SAP_USER=... SAP_PASSWORD=..."
echo "  3. Verify connection: $TARGET --version"
