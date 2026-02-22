/**
 * VEIL Infrastructure — Agent Self-Provisioning
 *
 * Agents provision their own compute and deploy VEIL validators.
 * This is the key ANIMA lifecycle milestone:
 *   1. Agent earns enough from markets
 *   2. Agent provisions own AWS/AvaCloud instance
 *   3. Agent deploys VEIL validator node
 *   4. Agent becomes first-class chain participant
 */

export interface InfraInstance {
  id: string;
  provider: "avacloud" | "aws" | "manual";
  region: string;
  status: "provisioning" | "running" | "stopped" | "error";
  ip?: string;
  specs: {
    vcpu: number;
    memoryMb: number;
    diskGb: number;
  };
  createdAt: string;
  validatorNodeId?: string;
}

export interface ValidatorStatus {
  nodeId: string;
  isActive: boolean;
  stakeAmount: string;
  delegatedAmount: string;
  uptimePercent: number;
  lastHeartbeat: string;
}

export interface ProvisionParams {
  provider: "avacloud" | "aws";
  region?: string;
  vcpu?: number;
  memoryMb?: number;
  diskGb?: number;
}

export class VeilInfra {
  private avacloudApiKey?: string;
  private awsAccessKey?: string;
  private awsSecretKey?: string;

  constructor(config?: {
    avacloudApiKey?: string;
    awsAccessKey?: string;
    awsSecretKey?: string;
  }) {
    this.avacloudApiKey = config?.avacloudApiKey;
    this.awsAccessKey = config?.awsAccessKey;
    this.awsSecretKey = config?.awsSecretKey;
  }

  /**
   * Provision a new compute instance for running a VEIL validator.
   * This is the agent's "getting a home" milestone.
   */
  async provision(params: ProvisionParams): Promise<InfraInstance> {
    if (params.provider === "avacloud") {
      return this.provisionAvaCloud(params);
    }
    if (params.provider === "aws") {
      return this.provisionAWS(params);
    }
    throw new Error(`Unsupported provider: ${params.provider}`);
  }

  /** List all provisioned instances */
  async listInstances(): Promise<InfraInstance[]> {
    // TODO: query AvaCloud API / AWS API for instances tagged with ANIMA
    return [];
  }

  /** Get validator status for a node */
  async getValidatorStatus(nodeId: string): Promise<ValidatorStatus | null> {
    // TODO: query P-chain for validator info
    return null;
  }

  /** Deploy VEIL validator on a provisioned instance */
  async deployValidator(instanceId: string, stakeAmount: string): Promise<{
    nodeId: string;
    success: boolean;
  }> {
    // TODO: SSH into instance, install AvalancheGo + VeilVM plugin,
    // register validator on P-chain, stake VEIL
    throw new Error("Validator deployment not yet implemented — requires AvaCloud API integration");
  }

  /** Check infrastructure health */
  async healthCheck(instanceId: string): Promise<{
    reachable: boolean;
    nodeRunning: boolean;
    chainSynced: boolean;
    diskUsagePercent: number;
  }> {
    // TODO: probe instance health
    throw new Error("Health check not yet implemented");
  }

  private async provisionAvaCloud(params: ProvisionParams): Promise<InfraInstance> {
    if (!this.avacloudApiKey) {
      throw new Error("AvaCloud API key required. Set it in ~/.anima/anima.json");
    }
    // TODO: call AvaCloud API to provision a node
    // https://docs.avacloud.io/
    throw new Error("AvaCloud provisioning not yet implemented");
  }

  private async provisionAWS(params: ProvisionParams): Promise<InfraInstance> {
    if (!this.awsAccessKey || !this.awsSecretKey) {
      throw new Error("AWS credentials required. Set them in ~/.anima/anima.json");
    }
    // TODO: use AWS SDK to provision EC2 instance
    throw new Error("AWS provisioning not yet implemented");
  }
}
