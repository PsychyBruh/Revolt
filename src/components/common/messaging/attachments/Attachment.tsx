import { Attachment as AttachmentRJS } from "revolt.js/dist/api/objects";

import styles from "./Attachment.module.scss";
import classNames from "classnames";
import { Text } from "preact-i18n";
import { useContext, useState } from "preact/hooks";

import { useIntermediate } from "../../../../context/intermediate/Intermediate";
import { AppContext } from "../../../../context/revoltjs/RevoltClient";

import AttachmentActions from "./AttachmentActions";
import TextFile from "./TextFile";
import { SizedGrid } from "./Grid";

interface Props {
    attachment: AttachmentRJS;
    hasContent: boolean;
}

const MAX_ATTACHMENT_WIDTH = 480;

export default function Attachment({ attachment, hasContent }: Props) {
    const client = useContext(AppContext);
    const { openScreen } = useIntermediate();
    const { filename, metadata } = attachment;
    const [spoiler, setSpoiler] = useState(filename.startsWith("SPOILER_"));
    const [loaded, setLoaded] = useState(false);

    const url = client.generateFileURL(
        attachment,
        { width: MAX_ATTACHMENT_WIDTH * 1.5 },
        true,
    );

    switch (metadata.type) {
        case "Image": {
            return (
                <SizedGrid width={metadata.width} height={metadata.height}
                    className={classNames({ [styles.margin]: hasContent })}>
                    <img src={url} alt={filename}
                        className={styles.image}
                        loading="lazy"
                        onClick={() =>
                            openScreen({ id: "image_viewer", attachment })
                        }
                        onMouseDown={(ev) =>
                            ev.button === 1 && window.open(url, "_blank")
                        } />
                </SizedGrid>
            )
        }
        case "Video": {
            return (
                <div className={classNames(styles.container, { [styles.margin]: hasContent })}
                    style={{ '--width': metadata.width + 'px' }}>
                    <AttachmentActions attachment={attachment} />
                    <SizedGrid width={metadata.width} height={metadata.height}>
                        <video src={url} alt={filename}
                            controls
                            loading="lazy"
                            width={metadata.width}
                            height={metadata.height}
                            onMouseDown={(ev) =>
                                ev.button === 1 && window.open(url, "_blank")
                            }
                        />
                    </SizedGrid>
                </div>
            )
        }




            /*return (
                <div
                    className={styles.container}
                    onClick={() => spoiler && setSpoiler(false)}>
                    {spoiler && (
                        <div className={styles.overflow}>
                            <span>
                                <Text id="app.main.channel.misc.spoiler_attachment" />
                            </span>
                        </div>
                    )}
                    <img
                        src={url}
                        alt={filename}
                        width={metadata.width}
                        height={metadata.height}
                        loading="lazy"
                        data-has-content={hasContent}
                        data-spoiler={spoiler}
                        className={classNames(
                            styles.attachment,
                            styles.image,
                            loaded && styles.loaded,
                            metadata.width > metadata.height
                                ? styles.long
                                : styles.tall,
                        )}
                        style={{
                            "--width": metadata.width,
                            "--height": metadata.height,
                            "--width-px": metadata.width + "px",
                            "--height-px": metadata.height + "px",
                        }}
                        onClick={() =>
                            openScreen({ id: "image_viewer", attachment })
                        }
                        onMouseDown={(ev) =>
                            ev.button === 1 && window.open(url, "_blank")
                        }
                        onLoad={() => setLoaded(true)}
                    />
                </div>
            );
        }*/
        case "Audio": {
            return (
                <div
                    className={classNames(styles.attachment, styles.audio)}
                    data-has-content={hasContent}>
                    <AttachmentActions attachment={attachment} />
                    <audio src={url} controls />
                </div>
            );
        }
        /*case "Video": {
            return (
                <div
                    className={styles.container}
                    onClick={() => spoiler && setSpoiler(false)}>
                    {spoiler && (
                        <div className={styles.overflow}>
                            <span>
                                <Text id="app.main.channel.misc.spoiler_attachment" />
                            </span>
                        </div>
                    )}
                    <div
                        data-spoiler={spoiler}
                        data-has-content={hasContent}
                        className={classNames(styles.attachment, styles.video)}>
                        <AttachmentActions attachment={attachment} />
                        <video
                            src={url}
                            width={metadata.width}
                            height={metadata.height}
                            loading="lazy"
                            className={classNames(
                                metadata.width > metadata.height
                                    ? styles.long
                                    : styles.tall,
                            )}
                            style={{
                                "--width": metadata.width,
                                "--height": metadata.height,
                                "--width-px": metadata.width + "px",
                                "--height-px": metadata.height + "px",
                            }}
                            controls
                            onMouseDown={(ev) =>
                                ev.button === 1 && window.open(url, "_blank")
                            }
                        />
                    </div>
                </div>
            );
        }*/
        case "Text": {
            return (
                <div
                    className={classNames(styles.attachment, styles.text)}
                    data-has-content={hasContent}>
                    <TextFile attachment={attachment} />
                    <AttachmentActions attachment={attachment} />
                </div>
            );
        }
        default: {
            return (
                <div
                    className={classNames(styles.attachment, styles.file)}
                    data-has-content={hasContent}>
                    <AttachmentActions attachment={attachment} />
                </div>
            );
        }
    }
}
