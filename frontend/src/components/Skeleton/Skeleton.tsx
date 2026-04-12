import clsx from "clsx";

import type { SkeletonProps } from "./Skeleton.props";

const Skeleton = ({ customClassNames = '' }: SkeletonProps) => {
    return <div className={clsx('animate-pulse bg-gray-300 rounded', customClassNames)} />
}

export default Skeleton;