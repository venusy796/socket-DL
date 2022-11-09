import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, ContractFactory } from "ethers";
import { fastIntegration } from "../../constants/config";
import { verify, integrationType } from "../utils";

export default async function deployVerifier(contractName: string, timeout: number, notary: Contract, signer: SignerWithAddress) {
  try {
    let args;

    if (contractName === "Verifier") {
      args = [signer.address, notary.address, timeout, integrationType(fastIntegration)]
    } else if (contractName === "NativeBridgeVerifier") {
      args = [signer.address, notary.address]
    }

    const verifier: ContractFactory = await ethers.getContractFactory(contractName);
    const verifierContract: Contract = await verifier.connect(signer).deploy(...args);
    await verifierContract.deployed();

    await verify(verifierContract.address, contractName, args);
    return verifierContract;
  } catch (error) {
    throw error;
  }
}