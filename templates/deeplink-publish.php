<?php
/* @var $this WP_MTPC */
global $post;
$autoName       = "mtpc_deeplink_auto_default";
$deepLinkActive = ( $this->hasActiveAccount() ) ? get_option( $autoName ) : get_site_option( $autoName );
$deepLinkPost   = ( $this->isEditPage( "new" ) ) ? $deepLinkActive : get_post_meta( $post->ID, "mtpc_deeplink_auto", true );
$deepLinkStatus = ( $deepLinkPost ) ? esc_html__( "Active", "metapic" ) : esc_html__( "Inactive", "metapic" );
?>
<div class="misc-pub-section mtpc-deeplinking">
	<span class="mtpc-deeplink-text"><?php esc_html_e( "Auto link content:", "metapic" ) ?></span>
	<span id="deeplink-status-display">
		<span class="deeplink-status-text status-0" <?php if ( $deepLinkPost ) { ?>style="display: none;"<?php } ?>><?php esc_html_e( "Inactive", "metapic" ) ?></span>
		<span class="deeplink-status-text status-1" <?php if ( ! $deepLinkPost ) { ?>style="display: none;"<?php } ?>><?php esc_html_e( "Active", "metapic" ) ?></span>
	</span>
	<a href="#deeplink-status-select" class="edit-deeplink-status hide-if-no-js"><span
			aria-hidden="true"><?php esc_html_e( 'Edit', 'metapic' ); ?></span> <span
			class="screen-reader-text"><?php esc_html_e( 'Edit auto linking', 'metapic' ); ?></span></a>

	<div class="hide-if-js" id="deeplink-status-select">
		<div class="deeplink-status-edit">
			<input type="hidden" value="<?php echo esc_attr( $deepLinkPost ); ?>" id="deeplink-status-auto" name="mtpc_deeplink_auto" />
			<input type="checkbox" value="1" id="deeplink-status-check" name="mtpc_deeplink_auto_check" <?php checked( $deepLinkPost ); ?>>
			<label class="selectit" for="deeplink-status-check"><?php esc_html_e( "Activate auto linking", "metapic" ) ?></label>
		</div>
		<p>
			<a class="save-deeplink-status hide-if-no-js button" href="#deeplink-status-select"><?php esc_html_e( 'OK', 'metapic' ); ?></a>
			<a class="cancel-deeplink-status hide-if-no-js button-cancel" href="#deeplink-status-select"><?php esc_html_e( 'Cancel', 'metapic' ); ?></a>
		</p>
	</div>
</div>

<!--div class="hide-if-js" id="post-status-select" style="display: block;">
	<input type="hidden" value="publish" id="hidden_post_status" name="hidden_post_status">
	<select id="post_status" name="post_status">
		<option value="publish" selected="selected">Publicerat</option>
		<option value="pending">Väntar på granskning</option>
		<option value="draft">Utkast</option>
	</select>
	<a class="save-post-status hide-if-no-js button" href="#post_status">OK</a>
	<a class="cancel-post-status hide-if-no-js button-cancel" href="#post_status">Avbryt</a>
</div-->