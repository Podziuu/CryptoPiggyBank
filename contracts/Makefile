DEFAULT_ANVIL_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
DEFAULT_ANVIL_ADDRES := 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

NETWORK_ARGS := --rpc-url http://localhost:8545 --private-key $(DEFAULT_ANVIL_KEY) --broadcast

deploy:
	@forge script script/DeployPiggyBank.s.sol:DeployPiggyBank $(NETWORK_ARGS)