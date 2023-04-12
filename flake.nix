{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-22.11";
    unixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs, unixpkgs }:
    let
      systems = [ "aarch64-linux" "aarch64-darwin" ];
    in
    builtins.foldl'
      (ss: s:
        let
          pkgs = nixpkgs.legacyPackages."${s}";
          upkgs = unixpkgs.legacyPackages."${s}";
        in
        ss //
        {
          devShells."${s}".default = pkgs.mkShell {
            packages = [
              pkgs.nodejs
              pkgs.nodePackages_latest.typescript
              pkgs.nodePackages_latest.typescript-language-server
              pkgs.nodePackages_latest.http-server
              pkgs.nodePackages_latest.prettier
            ];
          };
          formatter."${s}" = nixpkgs.legacyPackages."${s}".nixpkgs-fmt;
        })
      { }
      systems;
}
